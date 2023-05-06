from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.http import JsonResponse
from .models import Friending
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from datetime import datetime
from users.models import AppUser
from django.urls import reverse


class IndexView(LoginRequiredMixin, View):
    def get(self, request, second_user_id):
        current_user = request.user
        second_user = get_object_or_404(AppUser, pk=second_user_id)
        all_friend_users = Friending.get_all_friend_users(second_user)
        friend_list = [{
            'full_name': f.__str__(),
            'friend_profile_picture': f.get_profile_picture_friend(),
            'friend_state': Friending.get_state(current_user, f),
            'friend_profile_url': reverse('posts:profile', args=(f.id,)),
            'urls': {
                'add_friend': reverse('friending:general', args=(f.id,)),
                'cancel_request': reverse('friending:delete', args=(f.id,)),
                'confirm_request': reverse('friending:update', args=(f.id,)),
                'delete_request': reverse('friending:delete', args=(f.id,)),
                'unfriend': reverse('friending:delete', args=(f.id,)),
            }
        } for f in all_friend_users]
        return JsonResponse({'friend_list': friend_list})


class GeneralView(LoginRequiredMixin, View):
    # add friend
    def post(self, request, second_user_id):
        user = request.user
        second_user = get_object_or_404(AppUser, pk=second_user_id)
        state = Friending.get_state(user, second_user)
        if not state == Friending.State.non_friend:
            return JsonResponse({'error': 'Bad request'})
        # create Friending record with sent_user
        Friending.add_friend(user, second_user)
        return JsonResponse({'state': Friending.State.request_sent})

    def get(self, request, second_user_id):
        second_user = get_object_or_404(AppUser, pk=second_user_id)
        user = request.user
        state = Friending.get_state(user, second_user)
        return JsonResponse({'state': state})


class UpdateView(LoginRequiredMixin, View):
    # accept request
    def post(self, request, second_user_id):
        second_user = get_object_or_404(AppUser, pk=second_user_id)
        user = request.user
        state = Friending.get_state(user, second_user)
        if not state == Friending.State.request_received:
            return JsonResponse({'error': 'Bad request'})
        Friending.accept_request(user, second_user)
        return JsonResponse({'state': Friending.State.friend})


class DeleteView(LoginRequiredMixin, View):
    # accept request
    def post(self, request, second_user_id):
        second_user = get_object_or_404(AppUser, pk=second_user_id)
        user = request.user
        state = Friending.get_state(user, second_user)
        if state == Friending.State.non_friend:
            return JsonResponse({'error': 'Bad request'})
        Friending.delete(user, second_user)
        return JsonResponse({'state': Friending.State.non_friend})


class RequestIndexView(LoginRequiredMixin, View):
    def get(self, request):
        current_user = request.user

        all_friend_requests = Friending.get_friend_requests(current_user)
        friend_list = [{
            'full_name': f.__str__(),
            'friend_profile_picture': f.get_profile_picture_friend(),
            'friend_state': Friending.get_state(current_user, f),
            'friend_profile_url': reverse('posts:profile', args=(f.id,)),
            'urls': {
                'add_friend': reverse('friending:general', args=(f.id,)),
                'cancel_request': reverse('friending:delete', args=(f.id,)),
                'confirm_request': reverse('friending:update', args=(f.id,)),
                'delete_request': reverse('friending:delete', args=(f.id,)),
                'unfriend': reverse('friending:delete', args=(f.id,)),
            }
        } for f in all_friend_requests]
        return JsonResponse({'friend_list': friend_list})
