from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Upload, Animal, Vote

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['free_uploads_remaining', 'total_uploads']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'profile']


class UploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Upload
        fields = ['id', 'name', 'category', 'image']

class AnimalSerializer(serializers.ModelSerializer):
    user_nickname = serializers.CharField(source="user.first_name", read_only=True)

    class Meta:
        model = Animal
        fields = ["id", "name", "category", "image", "votes", "user_nickname"]

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ["id", "user", "animal", "vote_value", "created_at"]
