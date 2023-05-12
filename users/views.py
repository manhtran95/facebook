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
            return render(request, 'users/login.html',  {})
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
        except IntegrityError as e:
            return JsonResponse({'error': 'Username already exists.'})

        login(request, user)
        return JsonResponse({'url': reverse('main:main', args=(user.id,))})


class LogoutView(LoginRequiredMixin, View):
    def post(self, request):
        logout(request)
        return HttpResponseRedirect(reverse('users:login'))


class SearchView(LoginRequiredMixin, View):
    def get(self, request):
        q = request.GET.get('q')
        r = {"user_list": [{"full_name": "s a", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_60,w_60/v1/media/profile_pictures/katheryn_winnick_i00jun.jpg", "friend_state": "REQUEST-RECEIVED", "main_url": "/users/13", "urls": {"add_friend": "/friends/13", "cancel_request": "/friends/13/delete", "confirm_request": "/friends/13/update", "delete_request": "/friends/13/delete", "unfriend": "/friends/13/delete"}}, {"full_name": "2 2", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_60,w_60/v1/media/profile_pictures/Cristiano_Ronaldo_2018_llglx2.jpg", "friend_state": "FRIEND", "main_url": "/users/17", "urls": {"add_friend": "/friends/17", "cancel_request": "/friends/17/delete", "confirm_request": "/friends/17/update", "delete_request": "/friends/17/delete", "unfriend": "/friends/17/delete"}}, {"full_name": "Nelson Harms", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_60,w_60/v1/media/profile_pictures/tang_thanh_ha_rbryku.jpg", "friend_state": "NON-FRIEND", "main_url": "/users/51", "urls": {"add_friend": "/friends/51", "cancel_request": "/friends/51/delete", "confirm_request": "/friends/51/update", "delete_request": "/friends/51/delete", "unfriend": "/friends/51/delete"}}, {"full_name": "Ruth Meek", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_60,w_60/v1/media/profile_pictures/katheryn_winnick_i00jun.jpg", "friend_state": "FRIEND", "main_url": "/users/39", "urls": {"add_friend": "/friends/39", "cancel_request": "/friends/39/delete", "confirm_request": "/friends/39/update", "delete_request": "/friends/39/delete", "unfriend": "/friends/39/delete"}}, {"full_name": "Jess Paige", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_60,w_60/v1/media/profile_pictures/tuong_san_pzuffr.jpg", "friend_state": "FRIEND", "main_url": "/users/38", "urls": {"add_friend": "/friends/38", "cancel_request": "/friends/38/delete", "confirm_request": "/friends/38/update", "delete_request": "/friends/38/delete", "unfriend": "/friends/38/delete"}}, {"full_name": "Shannon Watt", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_60,w_60/v1/media/profile_pictures/default-profile-picture_xdklkn.jpg", "friend_state": "FRIEND", "main_url": "/users/50", "urls": {"add_friend": "/friends/50", "cancel_request": "/friends/50/delete", "confirm_request": "/friends/50/update", "delete_request": "/friends/50/delete", "unfriend": "/friends/50/delete"}}, {"full_name": "Jordan Kochan", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_60,w_60/v1/media/profile_pictures/katheryn_winnick_i00jun.jpg", "friend_state": "REQUEST-RECEIVED", "main_url": "/users/45", "urls": {"add_friend": "/friends/45", "cancel_request": "/friends/45/delete", "confirm_request": "/friends/45/update", "delete_request": "/friends/45/delete", "unfriend": "/friends/45/delete"}}, {"full_name": "Alfred Moore", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_80,w_80/v1/media/profile_pictures/tuong_san_pzuffr.jpg", "friend_state": "FRIEND", "main_url": "/users/36", "urls": {"add_friend": "/friends/36", "cancel_request": "/friends/36/delete", "confirm_request": "/friends/36/update", "delete_request": "/friends/36/delete", "unfriend": "/friends/36/delete"}}, {"full_name": "Aaron Brinson", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_80,w_80/v1/media/profile_pictures/katheryn_winnick_i00jun.jpg", "friend_state": "FRIEND", "main_url": "/users/54", "urls": {"add_friend": "/friends/54", "cancel_request": "/friends/54/delete", "confirm_request": "/friends/54/update", "delete_request": "/friends/54/delete", "unfriend": "/friends/54/delete"}},
                           {"full_name": "Liza Gilman", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_80,w_80/v1/media/profile_pictures/anne-hathaway_wtefas.jpg", "friend_state": "FRIEND", "main_url": "/users/40", "urls": {"add_friend": "/friends/40", "cancel_request": "/friends/40/delete", "confirm_request": "/friends/40/update", "delete_request": "/friends/40/delete", "unfriend": "/friends/40/delete"}}, {"full_name": "Betty Price", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_80,w_80/v1/media/profile_pictures/default-profile-picture_xdklkn.jpg", "friend_state": "FRIEND", "main_url": "/users/41", "urls": {"add_friend": "/friends/41", "cancel_request": "/friends/41/delete", "confirm_request": "/friends/41/update", "delete_request": "/friends/41/delete", "unfriend": "/friends/41/delete"}}, {"full_name": "Leslie Lawson", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_80,w_80/v1/media/profile_pictures/default-profile-picture_xdklkn.jpg", "friend_state": "FRIEND", "main_url": "/users/46", "urls": {"add_friend": "/friends/46", "cancel_request": "/friends/46/delete", "confirm_request": "/friends/46/update", "delete_request": "/friends/46/delete", "unfriend": "/friends/46/delete"}}, {"full_name": "Sylvester Robertson", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_80,w_80/v1/media/profile_pictures/scarlett_johansson_p7ctuy.jpg", "friend_state": "FRIEND", "main_url": "/users/49", "urls": {"add_friend": "/friends/49", "cancel_request": "/friends/49/delete", "confirm_request": "/friends/49/update", "delete_request": "/friends/49/delete", "unfriend": "/friends/49/delete"}}, {"full_name": "Kevin Stickney", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_80,w_80/v1/media/profile_pictures/anne-hathaway_wtefas.jpg", "friend_state": "NON-FRIEND", "main_url": "/users/56", "urls": {"add_friend": "/friends/56", "cancel_request": "/friends/56/delete", "confirm_request": "/friends/56/update", "delete_request": "/friends/56/delete", "unfriend": "/friends/56/delete"}}, {"full_name": "Cassandra Oldham", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_80,w_80/v1/media/profile_pictures/casemiro_xwaave.jpg", "friend_state": "FRIEND", "main_url": "/users/62", "urls": {"add_friend": "/friends/62", "cancel_request": "/friends/62/delete", "confirm_request": "/friends/62/update", "delete_request": "/friends/62/delete", "unfriend": "/friends/62/delete"}}, {"full_name": "Mary Broadway", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_80,w_80/v1/media/profile_pictures/chris_e9yeky.jpg", "friend_state": "FRIEND", "main_url": "/users/64", "urls": {"add_friend": "/friends/64", "cancel_request": "/friends/64/delete", "confirm_request": "/friends/64/update", "delete_request": "/friends/64/delete", "unfriend": "/friends/64/delete"}}, {"full_name": "Caitlin Miller", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_80,w_80/v1/media/profile_pictures/anne-hathaway_wtefas.jpg", "friend_state": "FRIEND", "main_url": "/users/44", "urls": {"add_friend": "/friends/44", "cancel_request": "/friends/44/delete", "confirm_request": "/friends/44/update", "delete_request": "/friends/44/delete", "unfriend": "/friends/44/delete"}}, {"full_name": "Duc Anh Do", "profile_picture": "https://res.cloudinary.com/dtgokkyl1/image/upload/c_fill,h_80,w_80/v1/media/profile_pictures/chris_e9yeky.jpg", "friend_state": "FRIEND", "main_url": "/users/22", "urls": {"add_friend": "/friends/22", "cancel_request": "/friends/22/delete", "confirm_request": "/friends/22/update", "delete_request": "/friends/22/delete", "unfriend": "/friends/22/delete"}}]}
        return JsonResponse(r)


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
