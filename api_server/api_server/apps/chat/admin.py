from django.contrib import admin

import api_server.apps.chat.models as models

models = [
    models.Room,
    models.Tweet,
]

admin.site.register(models)
