"""model definitions of chat app"""
from django.db import models
from django.utils import timezone

from api_server.apps.custom_accounts.models import CustomUser
from api_server.lib.models.base import BaseModelWithUlid


class Room(BaseModelWithUlid):
    """Chat room"""

    label = models.CharField(max_length=64, unique=True)
    description = models.TextField(default='', null=True, blank=True)
    is_public = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    last_active_at = models.DateTimeField(default=timezone.now, blank=True)


class Tweet(BaseModelWithUlid):
    """Tweet in chat room"""
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    room = models.ForeignKey(to=Room, on_delete=models.CASCADE)
    message = models.CharField(max_length=1000, default='')
