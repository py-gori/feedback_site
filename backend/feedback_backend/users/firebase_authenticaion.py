import environ
import logging
import firebase_admin
import time
from firebase_admin import auth
from firebase_admin import credentials
from django.contrib.auth import get_user_model
from rest_framework import authentication

from .exceptions import NoAuthToken, InvalidAuthToken, FirebaseError

from utils.utils import upload_image

logger = logging.getLogger(__name__)

env = environ.Env(DEBUG=(bool, False))
DEBUG = env('DEBUG')
User = get_user_model()

cred = credentials.Certificate({
    'type': 'service_account',
    'project_id': env.get_value('GCP_PROJECT_ID', str),
    'private_key_id': env.get_value('GCP_PRIVATE_KEY_ID', str),
    'private_key': env.get_value('GCP_PRIVATE_KEY', str).replace('\\n', '\n'),
    'client_email': env.get_value('GCP_CLIENT_EMAIL', str),
    'client_id': env.get_value('GCP_CLIENT_ID', int),
    'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
    'token_uri': 'https://accounts.google.com/o/oauth2/token',
    'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
    'client_x509_cert_url': env.get_value('GCP_CLIENT_CERT_URL', str)
})

default_app = firebase_admin.initialize_app(cred)


# DRFのBaseAuthenticationクラスを継承してfirebase用の認証クラスを作る
class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            raise NoAuthToken('No auth token provided')

        # id_token = auth_header.split(' ').pop()
        id_token = auth_header
        decoded_token = None
        try:
            # フロント側との時差回避の為一時的にsleep. 本番では対策する
            # time.sleep(1)
            decoded_token = auth.verify_id_token(id_token, check_revoked=True)
        except auth.RevokedIdTokenError:
            logger.warning('Your auth token expired')
            raise FirebaseError('Your auth token expired')
        except Exception as e:
            logger.error(e)
            raise InvalidAuthToken('Invalid auth token')

        if not id_token or not decoded_token:
            return None

        try:
            uid = decoded_token['uid']
            fetch_user = auth.get_user(uid)

        except Exception:
            raise FirebaseError()

        dict_userdata = vars(fetch_user)
        # user = User.objects.get_or_create(uid=uid)

        if not User.objects.filter(uid=uid):
            email = dict_userdata['_data']['email']
            username = dict_userdata['_data']['displayName']
            try:
                last_name, first_name = username.split(' ')
            except ValueError:
                last_name, first_name = email.split('@')[0].split('-')
            avatar = upload_image(dict_userdata['_data']['photoUrl'], username)
            user = User.objects.create(uid=uid, email=email, username=username,
                                       first_name=first_name, last_name=last_name, avatar=avatar)
        else:
            user = User.objects.get(uid=uid)
        # user.profile.last_activity = timezone.localtime()
        return user, None

