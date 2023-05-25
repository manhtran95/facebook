from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.http import JsonResponse
from .models import Post, Photo
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from datetime import datetime
from users.models import AppUser
from friending.models import Friending
from helper.helper import compress_image, MAIN_MODE_ENUM
import json

NUM_POSTS_LOAD = 8


class NewsfeedDataView(LoginRequiredMixin, View):
    def get(self, request):
        user = request.user

        offset = int(request.GET['offset'])

        page, next_offset = Post.get_friend_posts(user, NUM_POSTS_LOAD, offset)

        return JsonResponse({'page': page, 'next_offset': next_offset})
