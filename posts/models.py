from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, User
from django.core.validators import RegexValidator
from .managers import CustomUserManager
from django.utils import timezone
from custom_auth.models import AppUser
from helper.helper import generateSentence

# Create your models here.


class Post(models.Model):
    post_text = models.TextField()
    pub_datetime = models.DateTimeField(
        'datetime published', default=timezone.now, blank=True)
    author = models.ForeignKey(AppUser, on_delete=models.CASCADE)

    @classmethod
    def make_post(cls, user):
        Post(post_text=generateSentence(), author=user).save()
