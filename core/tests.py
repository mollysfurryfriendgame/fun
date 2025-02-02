from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from core.models import UserProfile

class CreateOrUpdateUserTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.valid_data = {
            "email": "testuser@example.com",
            "name": "Test User"
        }
        self.invalid_data = {
            "email": "",
            "name": ""
        }

    def test_create_new_user(self):
        """
        Test creating a new user and corresponding UserProfile
        """
        response = self.client.post("/create-user/", self.valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "User created or updated successfully.")

        # Verify the user exists
        user = User.objects.get(email=self.valid_data["email"])
        self.assertIsNotNone(user)
        self.assertEqual(user.first_name, self.valid_data["name"])

        # Verify the UserProfile exists
        profile = UserProfile.objects.get(user=user)
        self.assertIsNotNone(profile)

    def test_update_existing_user(self):
        """
        Test updating an existing user and ensuring UserProfile exists
        """
        # Create a user and profile beforehand
        user = User.objects.create(username=self.valid_data["email"], email=self.valid_data["email"], first_name="Old Name")
        UserProfile.objects.create(user=user)

        # Send updated data
        response = self.client.post("/create-user/", self.valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "User created or updated successfully.")

        # Verify the user was updated
        user.refresh_from_db()
        self.assertEqual(user.first_name, self.valid_data["name"])

        # Verify the UserProfile still exists
        profile = UserProfile.objects.get(user=user)
        self.assertIsNotNone(profile)

    def test_missing_fields(self):
        """
        Test handling of missing email and name
        """
        response = self.client.post("/create-user/", self.invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "Email and name are required.")

    def test_partial_missing_fields(self):
        """
        Test handling of a missing name field
        """
        partial_data = {"email": "testuser@example.com"}
        response = self.client.post("/create-user/", partial_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
