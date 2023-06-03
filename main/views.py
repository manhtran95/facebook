from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.http import JsonResponse
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from users.models import AppUser
from friending.models import Friending
from helper.helper import MAIN_MODE_ENUM


"""
    1st-level views: main, search, newsfeed
    newsfeed_url, search_url: required at all 1st-level views
"""


class MainView(LoginRequiredMixin, View):
    def get(self, request, second_user_id):
        user = request.user
        data = {
            'mode': MAIN_MODE_ENUM.Profile,
            'current_user': {
                'full_name': user.__str__(),
                'id': user.id,
                'picture_mini': user.get_profile_picture_mini(),
            },
            'newsfeed_url': reverse('main:newsfeed', args=()),
            'search_url': reverse('users:search', args=()),
            'second_user_main_url': reverse('main:main', args=(second_user_id,)),
            'second_user_profile_url': reverse('main:profile', args=(second_user_id,)),
        }
        return render(request, 'main/main.html', data)


class NewsfeedView(LoginRequiredMixin, View):
    def get(self, request):
        user = request.user
        data = {
            'mode': MAIN_MODE_ENUM.Newsfeed,
            'current_user': {
                'full_name': user.__str__(),
                'id': user.id,
                'picture_mini': user.get_profile_picture_mini(),
            },
            'newsfeed_url': reverse('main:newsfeed', args=()),
            'newsfeed_data_url': reverse('posts:newsfeed_data', args=()),
            'search_url': reverse('users:search', args=()),
        }
        return render(request, 'main/main.html', data)


class ProfileView(LoginRequiredMixin, View):
    def get(self, request, second_user_id):
        current_user = request.user
        data = AppUser.get_profile_data(current_user, second_user_id)
        if not data:
            return JsonResponse({'error': 'Bad request.'})

        return JsonResponse({'profile': data})


def handler404(request, exception, template_name="404.html"):
    response = render(request, template_name, {})
    response.status_code = 404
    return response
