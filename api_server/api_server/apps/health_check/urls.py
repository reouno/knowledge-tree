"""health check app urls"""

from django.urls import path

from api_server.apps.health_check.views import HealthCheckView

urlpatterns = [
    path('health_check/', HealthCheckView.as_view()),
]
