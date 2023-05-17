from django.urls import path
from django.http import HttpResponse

from .views import GeneralView, PhotoDataView

app_name = 'posts'

urlpatterns = [
    path('users/<int:second_user_id>/posts',
         GeneralView.as_view(), name='create_index'),
    path('photos/<int:photo_id>/data',
         PhotoDataView.as_view(), name='photo_data'),
]
