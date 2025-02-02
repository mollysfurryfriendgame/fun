import json
import requests
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt

class Auth0JSONWebTokenAuthentication(BaseAuthentication):
    """Custom authentication class to verify JWT tokens from Auth0"""

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header:
            return None

        parts = auth_header.split()
        if parts[0].lower() != "bearer" or len(parts) != 2:
            raise AuthenticationFailed("Invalid Authorization header format")

        token = parts[1]
        try:
            # Get Auth0 public key
            jwks_url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
            try:
                jwks_response = requests.get(jwks_url)
                jwks_response.raise_for_status()
                jwks = jwks_response.json()
            except requests.exceptions.RequestException as e:
                raise AuthenticationFailed(f"Unable to fetch JWKS: {str(e)}")

            header = jwt.get_unverified_header(token)
            rsa_key = None

            for key in jwks["keys"]:
                if key["kid"] == header["kid"]:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"],
                    }
                    break  # Exit the loop when the correct key is found

            if not rsa_key:
                raise AuthenticationFailed("Unable to find appropriate key")

            # Decode token
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=settings.AUTH0_API_IDENTIFIER,
                issuer=f"https://{settings.AUTH0_DOMAIN}/",
            )

            return (payload, None)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")
