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
        user_list = [current_user.get_user_info(
            user) for user in all_friend_users]
        return JsonResponse({'user_list': user_list})


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
        user_list = [current_user.get_user_info(
            user) for user in all_friend_requests]
        return JsonResponse({'user_list': user_list})
