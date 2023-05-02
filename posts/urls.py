from django.urls import path
from django.http import HttpResponse

from . import views
from .post_views import CreateIndexView

app_name = 'posts'
urlpatterns = [
    path('', views.index, name='index'),
    path('users/<int:user_id>', views.profile, name='profile'),
    path('users/<int:user_id>/upload_profile',
         views.upload_profile_picture, name='upload_profile'),
    path('users/<int:user_id>/upload_cover',
         views.upload_cover_photo, name='upload_cover'),

    path('users/<int:second_user_id>/posts',
         CreateIndexView.as_view(), name='create_index'),
]
