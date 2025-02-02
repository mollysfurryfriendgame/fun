import json
import requests
import jwt
from jwt.exceptions import InvalidTokenError
from cryptography.hazmat.primitives import serialization

AUTH0_DOMAIN = "dev-uurrj85hw68pf4zr.us.auth0.com"

def get_public_key(token):
    """Retrieves the public key from JWKS and formats it as a PEM key."""

    try:
        header = jwt.get_unverified_header(token)
        if "kid" not in header:
            raise ValueError("JWT header does not contain 'kid'")

        kid = header["kid"]

        # Fetch JWKS from Auth0
        jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
        response = requests.get(jwks_url)
        jwks = response.json()

        # Find the key that matches the 'kid'
        key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
        if not key:
            raise ValueError("Public key not found in JWKS.")

        # Convert JWKS key to PEM format
        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(key))
        formatted_pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode("utf-8")

        return formatted_pem

    except Exception as e:
        raise InvalidTokenError(f"Failed to retrieve or parse public key: {str(e)}")
