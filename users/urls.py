from django.urls import path
from .views import LoginView, RegisterView, LogoutView, SearchView, SearchDataView, ProfilePictureView, CoverPhotoView

app_name = 'users'
urlpatterns = [
    path('login', LoginView.as_view(), name='login'),
    path('register', RegisterView.as_view(), name='register'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('search', SearchView.as_view(), name='search'),
    path('search_data', SearchDataView.as_view(), name='search_data'),
    path('upload_profile',
         ProfilePictureView.as_view(), name='upload_profile'),
    path('upload_cover',
         CoverPhotoView.as_view(), name='upload_cover'),
]
