from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.conf import settings
# from .models import AppUser
from django.views import View
from django.conf import settings as conf_settings
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.forms import ModelForm
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from users.models import AppUser
from django.db import IntegrityError
from django.http import JsonResponse
from fuzzy_match import algorithims


class LoginView(View):
    def get(self, request):
        user = request.user
        if user.is_authenticated:
            return HttpResponseRedirect(reverse('main:main', args=(user.id,)))
        else:
            return render(request, 'users/login.html', {})

    def post(self, request):
        body = request.POST
        username, password = body['username'], body['password']
        user = authenticate(request, username=username, password=password)
        if user is None:
            messages.error(request, "Invalid username and/or password!")
            return render(request, 'users/login.html', {})
        else:
            login(request, user)
            return HttpResponseRedirect(reverse('main:main', args=(user.id,)))


class RegisterView(View):
    def post(self, request):
        body = request.POST
        print(request.POST)
        username, email, password = body['username'], body['email'], body['password']
        try:
            user = AppUser.objects.create_user(
                username, email, password, first_name=body['first_name'], last_name=body['last_name'])
        except IntegrityError:
            return JsonResponse({'error': 'Username already exists.'})

        login(request, user)
        return JsonResponse({'url': reverse('main:main', args=(user.id,))})


class LogoutView(LoginRequiredMixin, View):
    def post(self, request):
        logout(request)
        return HttpResponseRedirect(reverse('users:login'))


class SearchView(LoginRequiredMixin, View):
    def get(self, request):
        current_user = request.user
        print(request)
        query = request.GET.get('q')
        search_data_url = reverse("users:search_data", args=())
        search_url = reverse("users:search", args=())
        return render(request, 'main/main.html', {
            'mode': 'search',
            'current_user': current_user,
            'newsfeed_url': reverse('main:newsfeed', args=()),
            'search_url': search_url,
            'search_data_url': f'{search_data_url}?q={query}',
        })


class SearchDataView(LoginRequiredMixin, View):
    TRIGRAM_THRESHOLD = 0.2

    def get(self, request):
        current_user = request.user
        query = request.GET.get('q')
        all_users = AppUser.objects.all()
        satisfied_users = []
        for user in all_users:
            query_trigram_score = algorithims.trigram(
                f'{user.first_name} {user.last_name}', query)
            if query_trigram_score > self.TRIGRAM_THRESHOLD:
                user.query_trigram_score = query_trigram_score
                satisfied_users.append(user)
        sorted_users = sorted(
            satisfied_users, key=lambda x: x.query_trigram_score, reverse=True)
        data = AppUser.get_users_data(current_user, sorted_users)

        return JsonResponse({"user_list": data})


class ProfilePictureView(LoginRequiredMixin, View):
    def post(self, request):
        user = request.user
        user.profile_picture = request.FILES['image']
        user.save()
        return JsonResponse({'url': user.get_profile_picture_round()})


class CoverPhotoView(LoginRequiredMixin, View):
    def post(self, request):
        user = request.user
        user.cover_photo = request.FILES['image']
        user.save()
        return JsonResponse({'url': user.get_cover_photo()})
