from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.http import JsonResponse
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from datetime import datetime
from users.models import AppUser
from django.urls import reverse
from friending.models import Friending
from django.contrib.auth.decorators import login_required


@login_required
def index(request):
    user = request.user
    return HttpResponseRedirect(reverse('main:main', args=(user.id,)))


class MainView(LoginRequiredMixin, View):
    def get(self, request, second_user_id):
        current_user = request.user
        data = {
            'current_user': current_user,
            'second_user_main_url': reverse('main:main', args=(second_user_id,))
        }
        return render(request, 'main/main.html', data)


class ProfileView(LoginRequiredMixin, View):
    def get(self, request, second_user_id):
        current_user = request.user
        second_user = get_object_or_404(AppUser, pk=second_user_id)
        data = {
            'second_user_id': second_user_id,
            # urls
            'posts_index_url': reverse('posts:create_index', args=(second_user_id,)),
            'posts_create_url': reverse('posts:create_index', args=(second_user_id,)),
            'upload_cover_photo_url': reverse('users:upload_cover', args=()),
            'upload_profile_picture_url': reverse('users:upload_profile', args=()),
            'friending_index_url': reverse('friending:index', args=(second_user_id,)),
            'friending_requests_url': reverse('friending:requests', args=()),
            # profile info
            'profile_picture_url_round': second_user.get_profile_picture_round(),
            'cover_url': second_user.get_cover_photo(),
            'first_name': second_user.first_name,
            'last_name': second_user.last_name,
            'num_friends': Friending.get_all_friend_friendings(second_user).count(),
            'main_friending_state': Friending.get_state(current_user, second_user),
        }
        return JsonResponse({'profile': data})


def handler404(request, exception, template_name="404.html"):
    response = render(request, template_name, {})
    response.status_code = 404
    return response
