from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserSerializer, UserProfileSerializer, UploadSerializer, AnimalSerializer, VoteSerializer
from .models import UserProfile, Upload, Animal, Vote
from .utils.auth import get_public_key
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

        # Get or create user using sub as the username
        user, created = User.objects.get_or_create(
            username=sub,  # Use `sub` as unique identifier
            defaults={"email": email, "first_name": nickname},
        )

        # Ensure UserProfile exists and update the auth0_sub
        user_profile, profile_created = UserProfile.objects.get_or_create(
            user=user,
            defaults={"auth0_sub": sub},  # Add auth0_sub when creating the profile
        )
        if not profile_created and user_profile.auth0_sub != sub:
            user_profile.auth0_sub = sub
            user_profile.save()

        serializer = UserSerializer(user)
        return Response(
            {
                "message": "User created or updated successfully.",
                "user": serializer.data,
                "profile_created": profile_created,
            },
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
    token = request.headers.get("Authorization", "").split("Bearer ")[-1]
    if not token:
        return Response({"error": "Authorization token missing"}, status=401)

    try:
        public_key = get_public_key(token)
        payload = decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=config("AUTH0_API_IDENTIFIER"),
            issuer=f"https://{config('AUTH0_DOMAIN')}/"
        )

        # Extract the user ID or email from the payload
        auth0_user_id = payload.get("sub")  # e.g., "auth0|123456789"
        email = payload.get("https://mffg-api/email")  # Custom claim for email

        # Fetch the corresponding Django user
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found in database"}, status=404)

        # Set the user to the request
        request.user = user

        # Now fetch the profile
        user_profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=200)

    except InvalidTokenError as e:
        return Response({"error": f"Invalid token: {str(e)}"}, status=403)
    except UserProfile.DoesNotExist:
        return Response({"error": "User profile not found"}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_animal(request):
    """
    Handle user animal uploads and notify admins via email.
    """
    serializer = UploadSerializer(data=request.data)
    if serializer.is_valid():
        upload = serializer.save(user=request.user)

        # Send notification email to admin
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

        return Response({"message": "Upload received and admin notified."}, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsSuperStaff])
def approve_upload(request, upload_id):
    try:
        # Fetch the upload object
        upload = Upload.objects.get(pk=upload_id)

        # Create an Animal with the appropriate fields, including the user
        animal = Animal.objects.create(
            name=upload.name,
            category=upload.category,
            image=upload.image,
            user=request.user,  # Associate the animal with the current user
        )

        # Delete the upload after creating the animal
        upload.delete()

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
