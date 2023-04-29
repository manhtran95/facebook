from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import AppUser


@login_required
def index(request):
    user = request.user
    return HttpResponseRedirect(reverse('posts:profile', args=(user.id,)))


@login_required
def profile(request, user_id):
    current_user = request.user
    user = get_object_or_404(AppUser, pk=user_id)
    return render(request, 'posts/profile.html', {
        'current_user': current_user,
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


def handler404(request, exception, template_name="404.html"):
    response = render(request, template_name, {})
    response.status_code = 404
    return response
