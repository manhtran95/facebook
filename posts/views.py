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

NUM_LOAD = 8


class GeneralView(LoginRequiredMixin, View):
    def post(self, request, second_user_id):
        """
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
        """
        user = request.user
        post = Post.objects.filter(author=user)[3]
        images = request.FILES.getlist('images')
        print(images)
        new_photo_urls = []
        from pprint import pprint
        from django.core.files.base import ContentFile
        from PIL import Image
        from io import BytesIO

        for oimage in images:
            pprint(vars(oimage))
            original_file_size = oimage.size
            filename = oimage._name
            name, ext = filename.split(".")
            # Open image with PIL
            img = Image.open(oimage)
            print('mode', img.mode)
            if img.mode == 'RGB':
                reduced_ratio = max(original_file_size / (100 * 1024), 1)
                # save image with reduced quality
                path = f"temp_images/image.jpg"
                img.save(path, optimize=True,
                         quality=int(100/reduced_ratio))
                # read image into img_io
                img_io = BytesIO()
                img_io.write(open(path, 'rb').read())
                img_content = ContentFile(img_io.getvalue(), filename)
            else:
                oimage.seek(0)
                img_content = oimage

            new_photo = Photo(author=user, post=post,
                              image=img_content)
            new_photo.save()
            new_photo_urls.append(new_photo.image.url)
        return JsonResponse({'urls': new_photo_urls})

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
            'post_text': p.post_text
        } for p in queryset]
        return JsonResponse({'page': l, 'counter': return_counter})
