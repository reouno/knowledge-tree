"""health check app app"""

from django.apps import AppConfig


class HealthCheckConfig(AppConfig):
    """Health check app config"""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api_server.apps.health_check'
