from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Post
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from datetime import datetime

NUM_LOAD = 10


class CreateIndexView(LoginRequiredMixin, View):
    def post(self, request, user_id):
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
        return JsonResponse({'new_post': p})

    def get(self, request, user_id):
        user = request.user
        counter = int(request.GET['counter'])
        queryset = Post.objects.order_by(
            '-pub_datetime')[counter:counter+NUM_LOAD]
        l = [{
            'author': p.author.__str__(),
            'author_image': p.author.get_profile_picture_mini(),
            'pub_timestamp': datetime.timestamp(p.pub_datetime)*1000,
            'post_text': p.post_text
        } for p in queryset]
        return JsonResponse({'page': l, 'counter': counter+NUM_LOAD})
