from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserSerializer, UserProfileSerializer
from .models import UserProfile
from .utils.auth import get_public_key
from jwt import decode, InvalidTokenError
from decouple import config


@api_view(['POST'])
def create_or_update_user(request):
    try:
        data = request.data
        email = data.get('email')
        name = data.get('name')

        if not email or not name:
            return Response({"error": "Email and name are required."}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(username=email, defaults={"email": email, "first_name": name})

        # Ensure UserProfile exists
        if created or not hasattr(user, 'userprofile'):
            UserProfile.objects.create(user=user)

        serializer = UserSerializer(user)
        return Response({"message": "User created or updated successfully.", "user": serializer.data}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



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
