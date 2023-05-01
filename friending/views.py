from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.http import JsonResponse
from .models import Friending
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from datetime import datetime
from custom_auth.models import AppUser


class GeneralView(LoginRequiredMixin, View):
    # add friend
    def post(self, request, second_user_id):
        second_user = get_object_or_404(AppUser, pk=second_user_id)
        user = request.user
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
