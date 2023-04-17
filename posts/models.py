from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, User
from django.core.validators import RegexValidator
from .managers import CustomUserManager

# Create your models here.

alphanumeric = RegexValidator(
    r'^[0-9a-zA-Z]+$', 'Only alphanumeric characters are allowed.')


class AppUser(AbstractUser):
    username = models.CharField(
        max_length=49, unique=True, validators=[alphanumeric])
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = [username]
    objects = CustomUserManager()
