from django.test import TestCase
from .models import AppUser
from django.core.exceptions import ValidationError
# Create your tests here.


class AppUserModelTests(TestCase):
    def test_username_can_not_have_symbols(self):
        """
        Creating user with username with special symbols returns ValueError.
        """
        with self.assertRaisesMessage(ValueError, "Only allow alphanumeric characters for username!"):
            user = AppUser.objects.create_user(
                "username%", "test@gmail.com", "ab123456")

    def test_invalid_email(self):
        """
        Creating user with invalid email returns ValidationError.
        """
        with self.assertRaisesMessage(ValidationError, "Enter a valid email address."):
            user = AppUser.objects.create_user(
                "username", "test-gmail.com", "ab123456")

    def test_password_at_least_6_characters(self):
        """
        Creating user with password less than 6 characters returns ValidationError.
        """
        with self.assertRaisesMessage(ValidationError, "This password is too short. It must contain at least 6 characters."):
            user = AppUser.objects.create_user(
                "username", "test@gmail.com", "1f45")

    def test_entirely_numeric_password(self):
        """
        Creating user with password which is entirely numeric returns ValidationError.
        """
        with self.assertRaisesMessage(ValidationError, "This password is entirely numeric."):
            user = AppUser.objects.create_user(
                "username", "test@gmail.com", "12345678")
