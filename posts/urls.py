from django.urls import path

from . import views
from .auth_views import LoginView, RegisterView, LogoutView

app_name = 'posts'
urlpatterns = [
    path('', views.index, name='index'),
    path('users/<int:user_id>', views.home, name='home'),
    path('users/<int:user_id>/upload_profile',
         views.upload_profile_picture, name='upload_profile'),
    path('users/<int:user_id>/upload_cover',
         views.upload_cover_photo, name='upload_cover'),

    path('login', LoginView.as_view(), name='login'),
    path('register', RegisterView.as_view(), name='register'),
    path('logout', LogoutView.as_view(), name='logout'),
]
