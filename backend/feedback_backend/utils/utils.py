import requests
from io import BytesIO
from google.cloud import storage

from django.conf import settings


def upload_image(image_url, username):
    image = get_image_bytes(image_url)
    client = get_gcs_client()

    bucket = client.get_bucket(settings.GS_BUCKET_NAME)
    upload_path = f'user_images/{username}.png'
    blob_gcs = bucket.blob(upload_path)
    blob_gcs.upload_from_file(image)

    return upload_path


def get_image_bytes(image_url):
    res = requests.get(image_url)
    return BytesIO(res.content)


def get_gcs_client():
    return storage.Client(settings.GS_PROJECT_ID, credentials=settings.GS_CREDENTIALS)
