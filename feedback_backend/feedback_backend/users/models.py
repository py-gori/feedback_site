from django.db import models
from django.contrib.auth.models import PermissionsMixin, UserManager
from django.core.mail import send_mail
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.contrib.auth.models import PermissionManager
from PIL import Image
# Create your models here.


class User(AbstractBaseUser, PermissionsMixin):
    username_validator = UnicodeUsernameValidator()

    uid = models.CharField('uid', max_length=50, blank=True)
    username = models.CharField('username',
                                max_length=150,
                                unique=True,
                                validators=[username_validator],
                                error_messages={
                                    'unique': 'A user with that username already exists.'
                                })
    first_name = models.CharField('first_name', max_length=30, blank=True)
    last_name = models.CharField('last_name', max_length=30, blank=True)
    avatar = models.ImageField(upload_to='user_images', blank=True)
    email = models.EmailField('email address', unique=True, blank=False)
    is_staff = models.BooleanField(
        'staff status',
        default=False,
        help_text='Designates whether the user can log into this admin site.',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
        db_table = 'users'
        swappable = 'AUTH_USER_MODEL'
        indexes = [
            models.Index(fields=['uid'], name='uid_index')
        ]
        permissions = [
            ('change_profile', 'Change Profile'),
        ]

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'

    def get_short_name(self):
        return self.first_name
