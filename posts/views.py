from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.models import User
from django.urls import reverse


def index(request):
    user = request.user
    if user.is_authenticated:
        return HttpResponseRedirect(reverse('posts:home', args=(user.id,)))
    else:
        return HttpResponseRedirect(reverse('posts:login'))


def home(request, user_id):
    user = request.user
    if user.is_authenticated:
        return render(request, 'posts/home.html', {'user': user})
    else:
        return HttpResponseRedirect(reverse('posts:login'))
