import uuid

from django.db import models
from ulid import new as ulid_new


# ref: https://code.djangoproject.com/ticket/32689
def ulid_new_proxy():
    """generate ulid"""
    return ulid_new()


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class BaseModelWithUlid(BaseModel):
    id = models.CharField(primary_key=True, default=ulid_new_proxy, max_length=64, editable=False)

    class Meta:
        abstract = True
