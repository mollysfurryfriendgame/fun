from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import UserProfile
from .serializers import UserSerializer

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
