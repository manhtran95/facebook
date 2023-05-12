from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, User
from django.core.validators import RegexValidator
from users.managers import CustomUserManager
from django.db.models import Q
from enum import Enum
import names
import random
# from friending.models import Friending
from django.apps import apps
from django.urls import reverse

# Create your models here.


class AppUser(AbstractUser):
    username = models.CharField(
        max_length=49, unique=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures', default='media/profile_pictures/default-profile-picture_xdklkn.jpg')
    cover_photo = models.ImageField(null=True, upload_to='cover_photos')

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = [username]
    objects = CustomUserManager()

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

    def get_profile_picture(self, h, w):
        if self.profile_picture and 'upload/' in self.profile_picture.url:
            return self.profile_picture.url.replace('upload/', f'upload/c_fill,h_{h},w_{w}/')
        else:
            return 'https://res.cloudinary.com/dtgokkyl1/image/upload/v1683470568/media/basic_images/default-profile-picture_me5ztx.jpg'

    def get_profile_picture_round(self):
        return self.get_profile_picture(160, 160)

    def get_profile_picture_mini(self):
        return self.get_profile_picture(40, 40)

    def get_profile_picture_search(self):
        return self.get_profile_picture(60, 60)

    def get_profile_picture_friend(self):
        return self.get_profile_picture(80, 80)

    def get_cover_photo(self):
        if self.cover_photo and 'upload/' in self.cover_photo.url:
            return self.cover_photo.url.replace('upload/', 'upload/c_fill,h_463,w_1241/')
        else:
            return 'https://res.cloudinary.com/dtgokkyl1/image/upload/v1683470571/media/basic_images/default-cover-photo_furh0o.jpg'

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

    def get_user_info(self, user, mode='friend'):
        Friending = apps.get_model('friending.Friending')
        r = {
            'full_name': user.__str__(),
            'profile_picture': user.get_profile_picture_friend() if mode == 'friend' else user.get_profile_picture_search(),
            'friend_state': Friending.get_state(self, user),
            'main_url': reverse('main:main', args=(user.id,)),
            'urls': {
                'add_friend': reverse('friending:general', args=(user.id,)),
                'cancel_request': reverse('friending:delete', args=(user.id,)),
                'confirm_request': reverse('friending:update', args=(user.id,)),
                'delete_request': reverse('friending:delete', args=(user.id,)),
                'unfriend': reverse('friending:delete', args=(user.id,)),
            }
        }
        return r
