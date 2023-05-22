from django.urls import path
from django.http import HttpResponse

from .views import GeneralView, PhotoDataView, EditView, UpdateView, DeleteView, \
    LikeView, UnlikeView

app_name = 'posts'

urlpatterns = [
    path('users/<int:second_user_id>/posts',
         GeneralView.as_view(), name='create_index'),
    path('<int:post_id>/edit', EditView.as_view(), name='edit'),
    path('<int:post_id>/update', UpdateView.as_view(), name='update'),
    path('<int:post_id>/delete', DeleteView.as_view(), name='delete'),
    path('photos/<int:photo_id>/data',
         PhotoDataView.as_view(), name='photo_data'),

    path('likes/<int:post_id>', LikeView.as_view(), name='like_create_index'),
    path('likes/<int:post_id>/delete', UnlikeView.as_view(), name='like_delete'),

]
