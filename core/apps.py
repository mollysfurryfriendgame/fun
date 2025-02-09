# File: core/apps.py
from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core"

    def ready(self):
        from django.contrib.auth.models import User

        def user_str(self):
            # Prioritize displaying the first name, then email, then username
            return self.first_name or self.email or self.username

        # Safely add __str__ method after apps are ready
        User.add_to_class("__str__", user_str)
