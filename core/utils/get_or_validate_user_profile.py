from django.core.exceptions import ObjectDoesNotExist
from ..models import UserProfile


def get_or_validate_user_profile(user):
    try:
        return UserProfile.objects.get(user=user)
    except ObjectDoesNotExist:
        raise UserProfile.DoesNotExist("UserProfile not found. Please contact support.")
