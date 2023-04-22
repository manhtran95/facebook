from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Post


@login_required
def create(request, user_id):
    user = request.user
    body = request.POST
    newPost = Post(post_text=body['content'], author=user)
    newPost.save()
    return JsonResponse({'post_text': newPost.post_text})
