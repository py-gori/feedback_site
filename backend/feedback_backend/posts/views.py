from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from django.forms.models import model_to_dict
from rest_framework.settings import api_settings
from rest_framework import generics, mixins, views, viewsets

from .models import Comment, CommentImage, Post, PostImage
from .serializers import CommentModelSerializer, CommentImageSerializer,PostModelSerializer,PostDetailSerializer,\
    PostImageSerializer

# Create your views here.


class PostsViewSet(viewsets.ModelViewSet):

    authentication_classes = []
    permission_classes = []

    queryset = Post.objects.all()
    serializer_class = PostModelSerializer

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = PostDetailSerializer
        return super().retrieve(request, *args, **kwargs)
        # instance = self.get_object()
        # serializer = self.get_serializer(instance)
        #
        # comments = []
        # rep_comments = []
        # for comment in serializer.data['comments']:
        #     comment['replies'] = []
        #     if comment['reply_to'] == 0:
        #         comments.append(comment)
        #         continue
        #     rep_comments.append(comment)
        #
        # result = []
        # for comment in comments:
        #     for rep_comment in rep_comments:
        #         if comment['id'] == rep_comment['reply_to']:
        #             comment['replies'].append(rep_comment)
        #     result.append(comment)
        # res = serializer.data
        # res['comments'] = result
        #
        # return Response(res)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        voted_instances = instance.voted.all()
        voted_users = []
        for voted in voted_instances:
            voted_user = model_to_dict(voted)
            voted_users.append({
                'id': voted_user['id'],
                'username': voted_user['username'],
                'avatar': voted_user['avatar'].url if bool(voted_user['avatar']) is True else '',
            })
        res = serializer.data
        res['voted'] = voted_users
        return Response(res)


class CommentsViewSet(viewsets.ModelViewSet):

    authentication_classes = []
    permission_classes = []

    queryset = Comment.objects.all()
    serializer_class = CommentModelSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        hearted_instances = instance.hearted.all()
        hearted_users = []
        for hearted in hearted_instances:
            hearted_user = model_to_dict(hearted)
            hearted_users.append({
                'id': hearted_user['id'],
                'username': hearted_user['username'],
                'avatar': hearted_user['avatar'].url if bool(hearted_user['avatar']) is True else '',
            })
        res = serializer.data
        res['hearted'] = hearted_users
        return Response(res)


class PostImageViewSet(viewsets.ModelViewSet):

    authentication_classes = []
    permission_classes = []

    queryset = PostImage.objects.all()
    serializer_class = PostImageSerializer


class CommentImageViewSet(viewsets.ModelViewSet):

    authentication_classes = []
    permission_classes = []

    queryset = CommentImage.objects.all()
    serializer_class = CommentImageSerializer
