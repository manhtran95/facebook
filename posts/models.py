from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, User
from django.core.validators import RegexValidator
from .managers import CustomUserManager
from django.utils import timezone
from users.models import AppUser
from helper.helper import generate_sentence

# Create your models here.


class Post(models.Model):
    post_text = models.TextField()
    pub_datetime = models.DateTimeField(
        'datetime published', default=timezone.now, blank=True)
    author = models.ForeignKey(AppUser, on_delete=models.CASCADE)

    @classmethod
    def make_post(cls, user):
        Post(post_text=generate_sentence(), author=user).save()


def image_file_name(instance, filename):
    name, ext = filename.split('.')
    file_path = 'photos/user_{user_id}/{name}.{ext}'.format(
        user_id=instance.author.id, name=name, ext=ext)
    return file_path


class Photo(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=image_file_name)
    pub_datetime = models.DateTimeField(
        'datetime published', default=timezone.now)
