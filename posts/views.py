from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.models import User
from django.urls import reverse
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required


@login_required
def index(request):
    user = request.user
    return HttpResponseRedirect(reverse('posts:home', args=(user.id,)))


@login_required
def home(request, user_id):
    user = request.user
    return render(request, 'posts/home.html', {
        'user': user,
        'profile_url_round': user.get_profile_picture_round(),
        'cover_url': user.get_cover_photo(),
    })


@login_required
def upload_profile_picture(request, user_id):
    user = request.user
    user.profile_picture = request.FILES['image']
    user.save()
    return JsonResponse({'url': user.get_profile_picture_round()})


@login_required
def upload_cover_photo(request, user_id):
    user = request.user
    user.cover_photo = request.FILES['image']
    user.save()
    return JsonResponse({'url': user.get_cover_photo()})
