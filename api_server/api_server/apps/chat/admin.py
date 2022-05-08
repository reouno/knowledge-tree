"""admin config of chat app"""
from django.contrib import admin

from api_server.apps.chat import models


class RoomAdmin(admin.ModelAdmin):
    """Room model admin"""
    model = models.Room
    list_display = ('id', 'label', 'is_public', 'is_deleted', 'last_active_at',)


model_list = [
    models.Tweet,
]

admin.site.register(models.Room, RoomAdmin)
admin.site.register(model_list)
