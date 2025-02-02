from django.urls import path
from .views import (
    create_or_update_user
)

urlpatterns = [
    path("create-user/", create_or_update_user, name="create-user"),
]
