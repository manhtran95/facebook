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
from helper.helper import compress_image

NUM_LOAD = 8


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
        new_photo_urls = []
        for oimage in images:
            img_content = compress_image(oimage)
            new_photo = Photo(author=user, post=newPost,
                              image=img_content)
            new_photo.save()
            new_photo_urls.append(new_photo.get_post_image())
        p['photo_urls'] = new_photo_urls

        return JsonResponse({'new_post': p})

    def get(self, request, second_user_id):
        user = request.user
        second_user = get_object_or_404(AppUser, pk=second_user_id)
        state = Friending.get_state(user, second_user)
        if state != Friending.State.self and state != Friending.State.friend:
            return JsonResponse({'error': 'Bad request'})

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
            'photo_urls': [pt.get_post_image() for pt in p.photo_set.all()],
        } for p in queryset]
        return JsonResponse({'page': l, 'counter': return_counter})
