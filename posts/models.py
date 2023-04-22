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
    profile_picture = models.ImageField(
        null=True, upload_to='profile_pictures')
    cover_photo = models.ImageField(null=True, upload_to='cover_photos')

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = [username]
    objects = CustomUserManager()

    def get_profile_picture_round(self):
        if self.profile_picture and 'upload/' in self.profile_picture.url:
            return self.profile_picture.url.replace('upload/', 'upload/c_fill,h_160,w_160/')
        return ''

    def get_cover_photo(self):
        if self.cover_photo and 'upload/' in self.cover_photo.url:
            return self.cover_photo.url.replace('upload/', 'upload/c_fill,h_463,w_1241/')
        return ''
