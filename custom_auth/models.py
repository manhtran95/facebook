from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, User
from django.core.validators import RegexValidator
from custom_auth.managers import CustomUserManager
from django.db.models import Q
from enum import Enum
import names
import random

# Create your models here.


class AppUser(AbstractUser):
    username = models.CharField(
        max_length=49, unique=True)
    profile_picture = models.ImageField(
        null=True, upload_to='profile_pictures')
    cover_photo = models.ImageField(null=True, upload_to='cover_photos')

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = [username]
    objects = CustomUserManager()

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

    def get_profile_picture_round(self):
        if self.profile_picture and 'upload/' in self.profile_picture.url:
            return self.profile_picture.url.replace('upload/', 'upload/c_fill,h_160,w_160/')
        return ''

    def get_profile_picture_mini(self):
        if self.profile_picture and 'upload/' in self.profile_picture.url:
            return self.profile_picture.url.replace('upload/', 'upload/c_fill,h_40,w_40/')
        return ''

    def get_cover_photo(self):
        if self.cover_photo and 'upload/' in self.cover_photo.url:
            return self.cover_photo.url.replace('upload/', 'upload/c_fill,h_463,w_1241/')
        return ''

    @classmethod
    def make_user(cls):
        first_name = names.get_first_name()
        last_name = names.get_last_name()
        username = first_name.lower() + str(random.randint(100, 10000))
        email = username + "@gmail.com"
        password = 'abc123'
        try:
            user = AppUser.objects.create_user(
                username, email, password, first_name=first_name, last_name=last_name)
        except Exception as e:
            print(e)
        return user
