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
    return HttpResponseRedirect(reverse('main:profile', args=(user.id,)))


class MainView(LoginRequiredMixin, View):
    def get(self, request, second_user_id):
        current_user = request.user
        user = get_object_or_404(AppUser, pk=second_user_id)
        data = {
            'current_user': current_user,
            'user': user,
            'profile_url_round': user.get_profile_picture_round(),
            'cover_url': user.get_cover_photo(),
            'main_friending_state': Friending.get_state(current_user, user),
            'num_friends': Friending.get_all_friend_friendings(user).count(),
        }
        return render(request, 'main/main.html', data)


def handler404(request, exception, template_name="404.html"):
    response = render(request, template_name, {})
    response.status_code = 404
    return response
