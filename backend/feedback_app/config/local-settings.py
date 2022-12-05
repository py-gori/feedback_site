from .settings import *

DEBUG = True

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '[::1]',
]

CORS_ORIGIN_WHITELIST = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:80",
    "http://localhost:8000",
    "http://localhost",
    "http://0.0.0.0:8000",
]
