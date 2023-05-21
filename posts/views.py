from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Post, Photo
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from datetime import datetime
import time
from users.models import AppUser
from friending.models import Friending
from django import forms
from helper.helper import compress_image, MAIN_MODE_ENUM
import json

NUM_LOAD = 8


class PhotoDataView(LoginRequiredMixin, View):
    def get(self, request, photo_id):
        current_user = request.user
        # authorization
        photo = get_object_or_404(Photo, pk=photo_id)
        state = Friending.get_state(current_user, photo.author)
        if state != Friending.State.self and state != Friending.State.friend:
            return JsonResponse({'error': 'Permission denied!'})

        author = photo.author
        data = {
            'author': author.__str__(),
            'author_main_url': reverse('main:main', args=(author.id,)),
            'author_image': author.get_profile_picture_mini(),
            'pub_timestamp': datetime.timestamp(photo.pub_datetime)*1000,
            'full_url': photo.get_full_image(),
        }
        return JsonResponse({
            'photo': data,
        })


class GeneralView(LoginRequiredMixin, View):
    def post(self, request, second_user_id):
        # process post text
        user = request.user
        body = request.POST

        newPost = Post(post_text=body['content'], author=user)
        newPost.save()
        p = {
            'author': newPost.author.__str__(),
            'author_image': newPost.author.get_profile_picture_mini(),
            'pub_timestamp': datetime.timestamp(newPost.pub_datetime)*1000,
            'post_text': newPost.post_text
        }

        # process post images
        images = request.FILES.getlist('images')
        print(images)

        new_photos = []
        for oimage in images:
            img_content = compress_image(oimage)
            new_photo = Photo(author=user, post=newPost,
                              image=img_content)
            new_photo.save()
            new_photos.append({
                'image_url': new_photo.get_post_image(),
                'link': reverse('posts:photo_data', args=(new_photo.id,)),
            })
        p['photos'] = new_photos

        return JsonResponse({'new_post': p})

    def get(self, request, second_user_id):
        user = request.user
        second_user = get_object_or_404(AppUser, pk=second_user_id)
        state = Friending.get_state(user, second_user)
        if state != Friending.State.self and state != Friending.State.friend:
            return JsonResponse({'error': 'Permission denied!'})

        counter = int(request.GET['counter'])
        userPosts = Post.objects.filter(author_id=second_user_id)
        queryset = userPosts.order_by(
            '-pub_datetime')[counter:counter+NUM_LOAD]

        total_num = userPosts.count()
        return_counter = counter + NUM_LOAD if total_num >= counter + NUM_LOAD else -1

        l = [{
            'author': p.author.__str__(),
            'author_main_url': reverse('main:main', args=(p.author.id,)),
            'author_image': p.author.get_profile_picture_mini(),
            'pub_timestamp': datetime.timestamp(p.pub_datetime)*1000,
            'post_text': p.post_text,
            'post_edit_url': reverse('posts:edit', args=(p.id,)) if state == Friending.State.self else '',
            'photos': [{
                'image_url': pt.get_post_image(),
                'link': reverse('posts:photo_data', args=(pt.id,)),
            } for pt in p.photo_set.all()],
        } for p in queryset]
        return JsonResponse({'page': l, 'counter': return_counter})


class EditView(LoginRequiredMixin, View):
    def get(self, request, post_id):
        user = request.user
        post = get_object_or_404(Post, pk=post_id)
        if post.author.id != user.id:
            return JsonResponse({'error': 'Permission denied!'})
        data = {
            'post_text': post.post_text,
            'post_update_url': reverse('posts:update', args=(post.id,)),
            'photos': [{
                'image_url': pt.get_post_image(),
                'id': pt.id,
            } for pt in post.photo_set.all()],
        }
        return JsonResponse({'post': data})


class UpdateView(LoginRequiredMixin, View):
    def post(self, request, post_id):
        user = request.user
        post = get_object_or_404(Post, pk=post_id)
        if post.author.id != user.id:
            return JsonResponse({'error': 'Permission denied!'})

        body = request.POST
        post.post_text = body['content']
        post.save()

        # remove old images
        for removed_photo_id in json.loads(body['removedPhotoIds']):
            photo = get_object_or_404(Photo, pk=removed_photo_id)
            photo.image.delete()
            photo.delete()

        # add new images
        images = request.FILES.getlist('images')
        print(images)

        for oimage in images:
            img_content = compress_image(oimage)
            new_photo = Photo(author=user, post=post,
                              image=img_content)
            new_photo.save()

        data = {
            'post_text': post.post_text,
            'photos': [{
                'image_url': pt.get_post_image(),
                'link': reverse('posts:photo_data', args=(pt.id,)),
            } for pt in post.photo_set.all()],
        }
        return JsonResponse({'updated_post': data})
