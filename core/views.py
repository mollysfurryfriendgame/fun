from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserSerializer, UserProfileSerializer, UploadSerializer, AnimalSerializer, VoteSerializer
from .models import UserProfile, Upload, Animal, Vote
from .utils.auth import get_public_key
from .utils.get_or_validate_user_profile import get_or_validate_user_profile
from jwt import decode, InvalidTokenError
from decouple import config
from django.conf import settings
from django.core.mail import send_mail
from rest_framework.permissions import IsAdminUser
from core.permissions import IsSuperStaff
import logging
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import random



logger = logging.getLogger(__name__)

@api_view(['POST'])
def create_or_update_user(request):
    try:
        data = request.data
        email = data.get("email")
        nickname = data.get("name")  # Assuming 'name' represents nickname
        sub = data.get("sub")  # Auth0 `sub` field

        if not email or not nickname or not sub:
            return Response(
                {"error": "Fields 'email', 'name', and 'sub' are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Find user by email
        user = User.objects.filter(email=email).first()

        if user:
            # Update existing user's profile if `sub` differs
            user_profile, created = UserProfile.objects.get_or_create(user=user)
            if created:  # Ensure uploads are initialized only when the profile is first created
                user_profile.free_uploads_remaining = 5
                user_profile.total_uploads = 0
                user_profile.auth0_sub = sub
                user_profile.save()
            elif user_profile.auth0_sub != sub:
                user_profile.auth0_sub = sub
                user_profile.save()

            message = "User updated successfully."
        else:
            # Create new user and profile
            user = User.objects.create(
                username=sub,  # Use `sub` as a fallback for the username
                email=email,
                first_name=nickname,
            )
            user_profile = UserProfile.objects.create(
                user=user, auth0_sub=sub, free_uploads_remaining=5, total_uploads=0
            )
            message = "User created successfully."

        serializer = UserSerializer(user)
        return Response(
            {"message": message, "user": serializer.data},
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )









@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    try:
        token = request.headers.get("Authorization", "").split("Bearer ")[-1]
        if not token:
            return Response({"error": "Authorization token missing"}, status=401)

        public_key = get_public_key(token)
        payload = decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=config("AUTH0_API_IDENTIFIER"),
            issuer=f"https://{config('AUTH0_DOMAIN')}/"
        )

        email = payload.get("https://mffg-api/email")
        if not email:
            return Response({"error": "Email not found in token payload"}, status=400)

        # Fetch user
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found in database"}, status=404)

        # Fetch UserProfile
        try:
            user_profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Response({"error": "User profile not found"}, status=404)

        user_serializer = UserSerializer(user)
        profile_serializer = UserProfileSerializer(user_profile)

        return Response({
            "user": user_serializer.data,
            "profile": profile_serializer.data,
        }, status=200)

    except InvalidTokenError as e:
        return Response({"error": f"Invalid token: {str(e)}"}, status=403)
    except Exception as e:
        return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=500)



# File: views.py

from .serializers import UserProfileSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_animal(request):
    try:
        user_profile = get_or_validate_user_profile(request.user)

        # Debugging free_uploads_remaining
        logger.info(f"Free uploads before deduction: {user_profile.free_uploads_remaining}")

        if user_profile.free_uploads_remaining <= 0:
            return Response(
                {"error": "You have no uploads remaining. Please purchase more uploads."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = UploadSerializer(data=request.data)
        if serializer.is_valid():
            upload = serializer.save(user=request.user)

            # Deduct one free upload and update total uploads
            user_profile.free_uploads_remaining -= 1
            user_profile.total_uploads += 1
            user_profile.save()

            logger.info(f"Free uploads after deduction: {user_profile.free_uploads_remaining}")

            send_mail(
                subject="New Animal Upload to Review",
                message=f"""
You have a new upload to review:
Name: {upload.name}
Category: {upload.category}
Uploaded By: {upload.user.username}
""",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=["mollysfurryfriendgame@gmail.com"],
                fail_silently=False,
            )

            serializer = UploadSerializer(upload)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

    except UserProfile.DoesNotExist as e:
        logger.warning(f"UserProfile not found: {str(e)}")
        return Response(
            {"error": "UserProfile not found. Please contact support."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        logger.error(f"Unexpected error in upload_animal: {str(e)}")
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )






@api_view(['POST'])
@permission_classes([IsAuthenticated, IsSuperStaff])
def approve_upload(request, upload_id):
    try:
        upload = Upload.objects.get(pk=upload_id)

        # Create an Animal with the description field
        animal = Animal.objects.create(
            name=upload.name,
            category=upload.category,
            image=upload.image,
            user=upload.user,  # Use the original uploader's user
            description=upload.description  # Pass description
        )

        upload.delete()  # Delete the Upload after creating the Animal

        return Response({"detail": f"Upload approved. Animal '{animal.name}' created."}, status=200)

    except Upload.DoesNotExist:
        return Response({"detail": "Upload not found."}, status=404)
    except Exception as e:
        return Response({"detail": str(e)}, status=400)




@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsSuperStaff])
def delete_upload(request, upload_id):
    try:
        upload = Upload.objects.get(pk=upload_id)
        upload.delete()
        return Response({"detail": "Upload deleted successfully."}, status=200)
    except Upload.DoesNotExist:
        return Response({"detail": "Upload not found."}, status=404)
    except Exception as e:
        return Response({"detail": str(e)}, status=400)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])  # Ensure only superusers can delete
def delete_animal(request, animal_id):
    try:
        animal = Animal.objects.get(pk=animal_id)
        animal.delete()
        return Response({"message": "Animal deleted successfully."}, status=200)
    except Animal.DoesNotExist:
        return Response({"error": "Animal not found."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsSuperStaff])
def upload_list(request):
    if request.user.is_staff:
        uploads = Upload.objects.all()
    else:
        uploads = Upload.objects.filter(user=request.user)
    serializer = UploadSerializer(uploads, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def leaderboard_view(request, category):
    """
    Fetch the leaderboard for a specific category.
    """
    animals = Animal.objects.filter(category=category).order_by('-votes')
    serializer = AnimalSerializer(animals, many=True)
    return Response(serializer.data)


@csrf_exempt
def submit_vote(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            animal_id = data.get("animal_id")
            user_sub = data.get("user_id")  # Auth0 `sub` field

            if not animal_id or not user_sub:
                return JsonResponse({"error": "Animal ID and User ID are required."}, status=400)

            # Debug: Log user_sub being used
            print(f"Looking for user with auth0_sub: {user_sub}")

            # Fetch the UserProfile and associated user using `auth0_sub`
            user_profile = UserProfile.objects.get(auth0_sub=user_sub)
            user = user_profile.user  # Get the related User instance
            animal = Animal.objects.get(id=animal_id)

            # Create or update the vote
            vote, created = Vote.objects.get_or_create(user=user, animal=animal, defaults={"vote_value": 1})

            # Update vote and increment animal votes
            if not created:
                vote.vote_value += 1
                vote.save()

            animal.votes += 1
            animal.save()

            return JsonResponse({"message": "Vote successfully recorded."})
        except UserProfile.DoesNotExist:
            return JsonResponse({"error": f"UserProfile with auth0_sub {user_sub} not found."}, status=404)
        except Animal.DoesNotExist:
            return JsonResponse({"error": "Animal not found."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)



def get_random_animals(request, category):
    try:
        # Fetch animals from the category
        animals = list(Animal.objects.filter(category=category))

        if len(animals) < 6:
            return JsonResponse({"error": "Not enough animals in this category."}, status=400)

        # Select 6 random animals
        random_animals = random.sample(animals, 6)

        # Serialize animal data
        data = [
            {
                "id": animal.id,
                "name": animal.name,
                "description": animal.description,
                "image": animal.image.url,
                "votes": animal.votes,
                "category": animal.category,
            }
            for animal in random_animals
        ]

        return JsonResponse(data, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
