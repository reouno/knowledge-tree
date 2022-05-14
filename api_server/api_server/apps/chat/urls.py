"""routing of chat app"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api_server.apps.chat.views import RoomViewSet, TweetViewSet, MarkViewSet

router = DefaultRouter()

router.register('rooms', RoomViewSet)
router.register('tweets', TweetViewSet)
router.register('marks', MarkViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
