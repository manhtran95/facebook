from django.urls import path
from django.http import HttpResponse

from . import views
from .views import MainView, ProfileView, NewsfeedView

app_name = 'main'
urlpatterns = [
    path('', NewsfeedView.as_view(), name='newsfeed'),
    path('users/<int:second_user_id>', MainView.as_view(), name='main'),
    path('users/<int:second_user_id>/profile',
         ProfileView.as_view(), name='profile'),
]
