from django.shortcuts import render
from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions
from django.forms.models import model_to_dict

from .models import User
from .serializers import UsersSignInSerializer

# Create your views here.


class WhoAmIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = User.objects.get(id=request.user.id)
        res = {
            'id': user.id,
            'avatar': f'https://storage.cloud.google.com/feedback_site/{request.user.avatar.name}',
            'username': user.username,
            'is_staff': user.is_staff,
        }
        # print(model_to_dict(request.user))
        # return Response(res, status.HTTP_200_OK)
        return Response({
            'user': res,
            # 'auth': request.auth
        })


class UsersSignInViewSet(APIView):
    def get(self, request):
        return Response(status.HTTP_405_METHOD_NOT_ALLOWED)

    def post(self, request, *args, **kwargs):
        serializer = UsersSignInSerializer(instance=User(), data=request.data)
        if serializer.is_valid():
            user = self.exists_user(serializer.validated_data)
            if not user:
                user = User.objects.create_user(
                    serializer.validated_data['username'],
                    serializer.validated_data['email'],
                    '',
                    {'uid': serializer.validated_data['uid'],
                     'avatar': serializer.validated_data['avatar']
                     }
                )
                return Response(serializer.data, status.HTTP_201_CREATED)
            return Response(serializer.data, status.HTTP_200_OK)
        if 'username' in serializer.errors:
            return Response({}, status.HTTP_200_OK)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

    def exists_user(self, user_item):
        try:
            return User.objects.get(uid=user_item['uid'])
        except User.DoesNotExist:
            return False
