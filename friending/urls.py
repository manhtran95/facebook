from django.urls import path
from django.http import HttpResponse

from .views import GeneralView, UpdateView, DeleteView

app_name = 'friending'
urlpatterns = [
    # path('', views.index, name='index'),
    path('<int:second_user_id>', GeneralView.as_view(), name='general'),
    path('<int:second_user_id>/update', UpdateView.as_view(), name='update'),
    path('<int:second_user_id>/delete', DeleteView.as_view(), name='delete'),
]
