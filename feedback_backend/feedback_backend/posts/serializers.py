from rest_framework import serializers
from .models import Comment, CommentImage, Post, PostImage, User


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id',)


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ('image_path',)


class CommentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentImage
        fields = ('image_path',)


class CommentDetailSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    hearted = serializers.SerializerMethodField(read_only=True)
    images = CommentImageSerializer(many=True)
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', required=False)

    class Meta:
        model = Comment
        exclude = ('updated_at',)

    def get_user(self, obj):
        user = UserSerializer(
            User.objects.filter(pk=obj.user.id), many=True).data[0]
        return user

    def get_hearted(self, obj):
        ret = []
        for h in obj.hearted.all():
            ret.append(UserSerializer(
                User.objects.filter(pk=h.id), many=True).data[0])
        return ret

    def get_images(self, obj):
        ret = []
        for image in obj.images.all():
            ret.append(CommentImageSerializer(
                CommentImage.objects.filter(pk=image.id), many=True).data[0])
        return ret


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'avatar')


class PostModelSerializer(serializers.ModelSerializer):
    comment_count = serializers.SerializerMethodField(read_only=True)
    vote_count = serializers.SerializerMethodField(read_only=True)
    images = PostImageSerializer(many=True)
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', required=False)

    class Meta:
        model = Post
        exclude = ('updated_at',)

    def get_comment_count(self, obj):
        comment = CommentSerializer(
            Post.objects.filter(pk=obj.id).prefetch_related('comment_set').get().comment_set.all(), many=True).data
        return len(comment)

    def get_vote_count(self, obj):
        return len(obj.voted.all())

    def create(self, validated_data):
        # Many to Manyフィールドを一時的に除去
        images_data = validated_data.pop('images')
        validated_data.pop('voted')

        # posts保存
        post = Post.objects.create(**validated_data)

        # imagesフィールド保存
        for image_data in images_data:
            if 'image_path' not in image_data:
                continue
            image_path = image_data['image_path']
            image = PostImage.objects.create(image_path=image_path)
            image_instance = PostImage.objects.filter(pk=image.id)
            post.images.add(image_instance.get().id)

        return post

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            # ManyToManyフィールド更新時エラーとなる為、votedを除く
            if attr == 'voted' or attr == 'images':
                continue
            setattr(instance, attr, value)
        # votedを個別で追加or削除する
        try:
            instance.voted.get(pk=validated_data['voted'][0].id)
            instance.voted.remove(validated_data['voted'][0].id)
        except User.DoesNotExist:
            instance.voted.add(validated_data['voted'][0].id)
        except KeyError:
            pass

        try:
            instance.images.get(pk=validated_data['images'][0].id)
            instance.images.remove(pk=validated_data['images'][0].id)
        except PostImage.DoesNotExist:
            instance.images.add(validated_data['images'][0].id)
        except KeyError:
            pass

        instance.save()

        return instance


class PostDetailSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField(read_only=True)
    voted = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    images = serializers.SerializerMethodField(read_only=True)
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', required=False)

    class Meta:
        model = Post
        exclude = ('updated_at',)

    def get_comments(self, obj):
        c = CommentDetailSerializer(
            Post.objects.filter(pk=obj.id).prefetch_related('comment_set').get().comment_set.all(), many=True).data
        return c

    def get_voted(self, obj):
        ret = []
        for v in obj.voted.all():
            ret.append(UserSerializer(
                User.objects.filter(pk=v.id), many=True).data[0])
        return ret

    def get_user(self, obj):
        return UserSerializer(
            User.objects.get(pk=obj.user.id)).data

    def get_images(self, obj):
        ret = []
        for image in obj.images.all():
            ret.append(PostImageSerializer(
                PostImage.objects.filter(pk=image.id), many=True).data[0])
        return ret


class CommentModelSerializer(serializers.ModelSerializer):
    # user = serializers.SerializerMethodField(read_only=True)
    # hearted_users = serializers.SerializerMethodField(read_only=True)
    images = CommentImageSerializer(many=True)
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', required=False)

    class Meta:
        model = Comment
        exclude = ('updated_at',)

    # def get_user(self, obj):
    #     return UserSerializer(
    #         User.objects.get(pk=obj.user.id)).data

    # def get_hearted_users(self, obj):
    #     ret = []
    #     for v in obj.hearted.all():
    #         ret.append(UserSerializer(
    #             User.objects.filter(pk=v.id), many=True).data[0])
    #     return ret

    def get_images(self, obj):
        ret = []
        for image in obj.images.all():
            ret.append(CommentImageSerializer(
                CommentImage.objects.filter(pk=image.id), many=True).data[0])
        return ret

    def create(self, validated_data):
        # Many to Manyフィールドを一時的に除去
        images_data = validated_data.pop('images')
        validated_data.pop('hearted')

        # comment保存
        comment = Comment.objects.create(**validated_data)

        # imagesフィールド保存
        for image_data in images_data:
            if 'image_path' not in image_data:
                continue
            image_path = image_data['image_path']
            image = CommentImage.objects.create(image_path=image_path)
            image_instance = CommentImage.objects.filter(pk=image.id)
            comment.images.add(image_instance.get().id)

        return comment

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            # ManyToManyフィールド更新時エラーとなる為、heartedを除く
            if attr == 'hearted':
                continue
            setattr(instance, attr, value)
        # heartedを個別で追加or削除する
        try:
            instance.hearted.get(pk=validated_data['hearted'][0].id)
            instance.hearted.remove(validated_data['hearted'][0].id)
        except User.DoesNotExist:
            instance.hearted.add(validated_data['hearted'][0].id)
        except KeyError:
            pass

        try:
            instance.images.get(pk=validated_data['images'][0].id)
            instance.images.remove(pk=validated_data['images'][0].id)
        except CommentImage.DoesNotExist:
            instance.images.add(validated_data['images'][0].id)
        except KeyError:
            pass

        instance.save()

        return instance
