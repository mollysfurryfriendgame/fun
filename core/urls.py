from django.urls import path
from .views import (
    create_or_update_user,
    get_user_profile
)


urlpatterns = [
    path("create-user/", create_or_update_user, name="create-user"),
    path('userprofile/', get_user_profile, name='userprofile'),
]
