from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    free_uploads_remaining = models.IntegerField(default=1)
    total_uploads = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username
