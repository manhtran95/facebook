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


class NewsfeedDataView(LoginRequiredMixin, View):
    def get(self, request):
        user = request.user
        userPosts = Post.objects.filter(author_id=20)
        count = userPosts.count()

        queryset = userPosts.order_by(
            '-pub_datetime')[count-9:count-1]

        total_num = userPosts.count()
        # return_counter = counter + NUM_LOAD if total_num >= counter + NUM_LOAD else -1

        data = [p.get_info(user) for p in queryset]
        return JsonResponse({
            'page': data,
            'counter': 1,
        })
