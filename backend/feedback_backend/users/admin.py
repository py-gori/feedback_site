from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Register your models here.


@admin.register(User)
class AdminUserAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ()}),
        ('Personal info', {'fields': ('password', 'email', 'avatar')}),
        ('Permissions', {'fields': ('groups', 'user_permissions')}),
        ('Important dates', {'fields': ()}),
    )

    list_display = ('username', 'is_staff', 'is_superuser', 'created_at')
    list_filter = ('is_staff', 'is_superuser', 'groups')
    search_fields = ('username', 'email')
    filter_horizontal = ('groups', 'user_permissions')

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'email', 'avatar'),
        }),
    )

    actions = ['update_is_superuser', 'deleted_is_superuser', 'update_is_staff', 'deleted_is_staff']

    @admin.action(description='スタッフ権限を付与',permissions=('change',))
    def update_is_staff(self, request, queryset):
        queryset.update(is_staff=1)

    @admin.action(description='スタッフ権限を削除',permissions=('change',))
    def deleted_is_staff(self, request, queryset):
        queryset.update(is_staff=0)

    @admin.action(description='管理者権限を付与',permissions=('change',))
    def update_is_superuser(self, request, queryset):
        queryset.update(is_superuser=1)

    @admin.action(description='管理者権限を削除',permissions=('change',))
    def deleted_is_superuser(self, request, queryset):
        queryset.update(is_superuser=0)

