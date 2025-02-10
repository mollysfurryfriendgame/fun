from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    free_uploads_remaining = models.IntegerField(default=5)
    total_uploads = models.IntegerField(default=0)
    auth0_sub = models.CharField(max_length=255, unique=True, null=True, blank=True)  # Add auth0_sub field

    def reset_uploads(self):
        """Reset free uploads to 5 (e.g., after payment)."""
        self.free_uploads_remaining = 5
        self.save()
        
    def __str__(self):
        return self.user.username


class Animal(models.Model):
    CATEGORY_CHOICES = [
        ('dog', 'Dog'),
        ('cat', 'Cat'),
        ('horse', 'Horse'),
        ('bunbun', 'Bunbun'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to="animal_images/")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    votes = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="animals")
    created_at = models.DateTimeField(auto_now_add=True)  # Add created_at field

    def user_nickname(self):
        return self.user.username  # Define method for user_nickname

    def __str__(self):
        return self.name


class Upload(models.Model):
    CATEGORY_CHOICES = [
        ('dog', 'Dog'),
        ('cat', 'Cat'),
        ('horse', 'Horse'),
        ('bunbun', 'Bunbun'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    image = models.ImageField(upload_to='upload_images/')
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.category})"




class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE)
    vote_value = models.IntegerField(default=1)  # 1 for upvote
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'animal')  # Prevent duplicate votes
