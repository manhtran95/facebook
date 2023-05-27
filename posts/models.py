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
from django.db import connection
from helper import helper

# Create your models here.


class Post(models.Model):
    post_text = models.TextField()
    pub_datetime = models.DateTimeField(
        'datetime published', default=timezone.now, blank=True)
    author = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    likes = models.ManyToManyField(AppUser, related_name='liked_post')

    @classmethod
    def make_post_object(cls, user):
        return Post(post_text=generate_sentence(), author=user)

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

    """
        Retrive post data.
        For high performance, using following queryset methods when querying:
        Post.objects.select_related('author').prefetch_related('photo_set').prefetch_related('likes')
    """

    def get_post_data(self, user):
        author = self.author
        photos = self.photo_set.all()
        likes = self.likes.all()
        data = {
            'id': self.id,
            'author': author.__str__(),
            'author_main_url': reverse('main:main', args=(author.id,)),
            'author_image': author.get_profile_picture_mini(),
            'pub_timestamp': datetime.timestamp(self.pub_datetime)*1000,
            'post_text': self.post_text,
            'post_edit_url': reverse('posts:edit', args=(self.id,)) if author.id == user.id else '',
            'post_delete_url': reverse('posts:delete', args=(self.id,)) if author.id == user.id else '',
            'like_number': len(likes),
            'like_state': user in likes,
            'like_create_url': reverse('posts:like_create_index', args=(self.id,)),
            'like_delete_url': reverse('posts:like_delete', args=(self.id,)),
            'photos': [{
                'image_url': photo.get_post_image(),
                'link': reverse('posts:photo_data', args=(photo.id,)),
            } for photo in photos],
        }
        return data

    @classmethod
    def get_friend_posts(cls, user, limit, offset):
        post_list = []

        # get all posts that belong to user's friends
        with connection.cursor() as cursor:
            cursor.execute(
                """
                    SELECT p.id as pid
                    FROM posts_post p INNER JOIN users_appuser u 
                    ON author_id = u.id INNER JOIN friending_friending fr ON
                    (u.id=fr.second_id AND fr.first_id=%s OR fr.second_id=%s AND u.id=first_id) AND fr.state='FR'
                    ORDER BY p.pub_datetime DESC;
                """, [user.id, user.id]
            )
            columns = [col[0] for col in cursor.description]
            post_list = [dict(zip(columns, row)) for row in cursor.fetchall()]

        pid_list = []
        for post_data in post_list:
            pid_list.append(post_data['pid'])
        total_num = len(pid_list)
        next_offset = offset + limit if total_num > offset + limit else -1

        # get all posts' necessary data
        data = []
        for post in Post.objects.select_related('author').prefetch_related('photo_set').prefetch_related('likes')   \
                .filter(pk__in=pid_list).order_by('-pub_datetime')[offset:offset+limit]:
            data.append(post.get_post_data(user))

        return data, next_offset

    """
        FOR SEEDING
    """
    @classmethod
    def get_friend_post_ids(cls, user):
        post_list = []

        # get all posts that belong to user's friends
        with connection.cursor() as cursor:
            cursor.execute(
                """
                    SELECT p.id as pid
                    FROM posts_post p INNER JOIN users_appuser u 
                    ON author_id = u.id INNER JOIN friending_friending fr ON
                    (u.id=fr.second_id AND fr.first_id=%s OR fr.second_id=%s AND u.id=first_id) AND fr.state='FR'
                    ORDER BY p.pub_datetime DESC;
                """, [user.id, user.id]
            )
            columns = [col[0] for col in cursor.description]
            post_list = [dict(zip(columns, row)) for row in cursor.fetchall()]

        pid_list = []
        for post_data in post_list:
            pid_list.append(post_data['pid'])
        return pid_list

    @classmethod
    def test(cls):
        kwargs = {'pk__in': [3, 2]}
        return Post.objects.prefetch_related('photo_set').prefetch_related('likes').filter(**kwargs)

    @classmethod
    def get_likes(cls):
        l = [1, 2]
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM posts_post_likes WHERE post_id = %s OR post_id = %s", [
                    1, 2]
                # "SELECT * FROM posts_post_likes WHERE post_id = ANY(%s)", [l]
            )
            columns = [col[0] for col in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]


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
    # instance.image.delete()
    pass
