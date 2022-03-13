from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api_server.apps.chat.views import RoomViewSet, TweetViewSet

router = DefaultRouter()

router.register('rooms', RoomViewSet)
router.register('tweets', TweetViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
