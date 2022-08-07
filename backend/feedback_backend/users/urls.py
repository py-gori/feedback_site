from django.urls import path, include
from rest_framework import routers
from .views import UsersSignInViewSet, WhoAmIView

urlpatterns = [
    path('', WhoAmIView.as_view(), name='users')
]
