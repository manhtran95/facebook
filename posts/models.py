from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, User
from django.core.validators import RegexValidator
from .managers import CustomUserManager
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from custom_auth.models import AppUser

# Create your models here.


class Friending(models.Model):
    class FriendState(models.TextChoices):
        PENDING = "PE", _("Pending")
        FRIENDED = "FR", _("Friended")

    first = models.ForeignKey(
        AppUser, related_name='first_friending', on_delete=models.CASCADE)
    second = models.ForeignKey(
        AppUser, related_name='second_friending', on_delete=models.CASCADE)
    state = models.CharField(
        max_length=2,
        choices=FriendState.choices,
        default=FriendState.PENDING,
    )
    friend_datetime = models.DateTimeField('datetime friended', default=None)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['first', 'second'], name='friend_request')
        ]
        indexes = [
            models.Index(fields=('first', 'second')),
        ]


class Post(models.Model):
    post_text = models.TextField()
    pub_datetime = models.DateTimeField(
        'datetime published', default=timezone.now, blank=True)
    author = models.ForeignKey(AppUser, on_delete=models.CASCADE)
