from django.db import models

from users.models import User
# Create your models here.


class PostImage(models.Model):
    image_path = models.ImageField(upload_to='post_images', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'post_image'

    def __str__(self):
        return str(self.image_path)


class Post(models.Model):
    types = models.CharField('types', max_length=30)
    status = models.IntegerField('status', default=0)
    title = models.TextField('title', max_length=100)
    post_text = models.TextField('post_text', default='', max_length=1000)
    user = models.ForeignKey(User, verbose_name='user_id', on_delete=models.CASCADE)
    voted = models.ManyToManyField(User, related_name='voted', related_query_name='vote', blank=True)
    images = models.ManyToManyField(PostImage, related_name='image', related_query_name='images', blank=True)
    # image = models.ImageField(upload_to='post_images', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'posts'
        indexes = [
            models.Index(fields=['types'], name='status_index')
        ]

    def __str__(self):
        return self.title


class CommentImage(models.Model):
    image_path = models.ImageField(upload_to='comment_images', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'comment_image'

    def __str__(self):
        return str(self.image_path)


class Comment(models.Model):
    post = models.ForeignKey(Post, verbose_name='post_id', on_delete=models.CASCADE)
    user = models.ForeignKey(User, verbose_name='user', on_delete=models.CASCADE)
    comment_text = models.TextField('comment_text', default='', max_length=1000)
    hearted = models.ManyToManyField(User, related_name='hearted', related_query_name='heart', blank=True)
    images = models.ManyToManyField(CommentImage, related_name='images', related_query_name='image', blank=True)
    reply_to = models.IntegerField('reply_to', default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'comments'

    def __str__(self):
        return self.comment_text[:100]

