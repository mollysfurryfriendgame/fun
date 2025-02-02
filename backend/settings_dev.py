from .settings import *

DEBUG = True
ALLOWED_HOSTS = config('DEV_ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=lambda v: [s.strip() for s in v.split(',')])

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DEV_DB_NAME', default='mollysfurryfriendgame'),
        'USER': config('DEV_DB_USER', default='molly_user'),
        'PASSWORD': config('DEV_DB_PASSWORD', default='securepassword'),
        'HOST': config('DEV_DB_HOST', default='localhost'),
        'PORT': config('DEV_DB_PORT', default='5432'),
    }
}

# Debug toolbar
INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE.insert(0, 'debug_toolbar.middleware.DebugToolbarMiddleware')
INTERNAL_IPS = ['127.0.0.1']

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'core.authentication.Auth0JSONWebTokenAuthentication',  # Use custom Auth0 authentication
        'rest_framework.authentication.SessionAuthentication',  # Keep for DRF Browsable API
    ),
}

# CORS Configuration
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000',
    cast=lambda v: [s.strip() for s in v.split(',')]
)
CORS_ALLOW_CREDENTIALS = True


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
