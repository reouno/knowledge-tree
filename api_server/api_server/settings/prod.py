"""settings for the production"""
from .base import *

DEBUG = int(os.environ.get("DEBUG", default=0))

SECRET_KEY = os.environ.get('SECRET_KEY', default='a')

# can write with comma seperated format in .env file if multiple hosts
ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', default='*').split(',')

CSRF_TRUSTED_ORIGINS = os.environ.get('CSRF_TRUSTED_ORIGINS', default='*').split(',')

DATABASES = {
    "default": {
        "ENGINE": os.environ.get("SQL_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.environ.get("SQL_DATABASE", BASE_DIR / "db.sqlite3"),
        "USER": os.environ.get("SQL_USER", "user"),
        "PASSWORD": os.environ.get("SQL_PASSWORD", "password"),
        "HOST": os.environ.get("SQL_HOST", "localhost"),
        "PORT": os.environ.get("SQL_PORT", "5432"),
    }
}

SESSION_COOKIE_AGE = 60 * 60 * 24 * 7  # 1 week in seconds
SESSION_SAVE_EVERY_REQUEST = True

TIME_ZONE = os.environ.get('TIMEZONE', default='Asia/Tokyo')

STATIC_ROOT = BASE_DIR / 'staticfiles'
