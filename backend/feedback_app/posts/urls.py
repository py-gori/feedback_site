from django.urls import path, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('posts', views.PostsViewSet)
router.register('post_image', views.PostImageViewSet)
router.register('comments', views.CommentsViewSet)
router.register('comment_image', views.CommentImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
