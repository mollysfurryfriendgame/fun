from rest_framework.authentication import BaseAuthentication
from jwt import decode, InvalidTokenError
from decouple import config
from core.utils.auth import get_public_key  # Ensure import is correct
from django.contrib.auth import get_user_model  # Import Django User model


class Auth0User:
    """A simple class to wrap JWT payload as a user-like object."""
    def __init__(self, payload):
        self.payload = payload
        self.username = payload.get("https://mffg-api/email", "Unknown")
        self.email = payload.get("https://mffg-api/email", "Unknown")
        self.sub = payload.get("sub", None)

    @property
    def is_authenticated(self):
        return True  # Mark as authenticated

class Auth0JSONWebTokenAuthentication(BaseAuthentication):
    """Custom authentication class using Auth0 JWTs."""

    def authenticate(self, request):
        token = request.headers.get("Authorization", "").split("Bearer ")[-1]
        if not token:
            return None

        try:
            public_key = get_public_key(token)
            payload = decode(
                token,
                public_key,
                algorithms=["RS256"],
                audience=config("AUTH0_API_IDENTIFIER"),
                issuer=f"https://{config('AUTH0_DOMAIN')}/"
            )


            # Extract user info
            email = payload.get("https://mffg-api/email")
            sub = payload.get("sub")  # Auth0 unique ID

            if not email or not sub:
                raise InvalidTokenError("Missing email or sub in token payload.")

            User = get_user_model()  # Get Django User model

            # Get or create Django user
            user, created = User.objects.get_or_create(username=sub, defaults={"email": email})

            return user, None  # ✅ Return Django User object

        except InvalidTokenError as e:
            raise InvalidTokenError(f"Invalid token: {str(e)}")
