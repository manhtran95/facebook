from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, User
from django.core.validators import RegexValidator
from .managers import CustomUserManager
from django.utils import timezone
from users.models import AppUser
from helper.helper import generate_sentence
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.urls import reverse
from datetime import datetime

# Create your models here.


class Post(models.Model):
    post_text = models.TextField()
    pub_datetime = models.DateTimeField(
        'datetime published', default=timezone.now, blank=True)
    author = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    likes = models.ManyToManyField(AppUser, related_name='liked_post')

    @classmethod
    def make_post(cls, user):
        Post(post_text=generate_sentence(), author=user).save()

    def get_info(self, user):
        data = {
            'id': self.id,
            'author': self.author.__str__(),
            'author_main_url': reverse('main:main', args=(self.author.id,)),
            'author_image': self.author.get_profile_picture_mini(),
            'pub_timestamp': datetime.timestamp(self.pub_datetime)*1000,
            'post_text': self.post_text,
            'post_edit_url': reverse('posts:edit', args=(self.id,)) if self.author.id == user.id else '',
            'post_delete_url': reverse('posts:delete', args=(self.id,)) if self.author.id == user.id else '',
            'like_number': self.likes.count(),
            'like_state': self.likes.filter(id=user.id).exists(),
            'like_create_url': reverse('posts:like_create_index', args=(self.id,)),
            'like_delete_url': reverse('posts:like_delete', args=(self.id,)),
            'photos': [{
                'image_url': pt.get_post_image(),
                'link': reverse('posts:photo_data', args=(pt.id,)),
            } for pt in self.photo_set.all()],
        }
        return data


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

    def get_image(self, h, w):
        if self.image and 'upload/' in self.image.url:
            return self.image.url.replace('upload/', f'upload/c_fill,h_{h},w_{w}/')
        return ''

    def get_post_image(self):
        return self.get_image(193, 193)

    def get_full_image(self):
        return self.image.url if self.image else ''


@receiver(pre_delete, sender=Photo)
def delete_image(sender, instance, using, **kwargs):
    instance.image.delete()
