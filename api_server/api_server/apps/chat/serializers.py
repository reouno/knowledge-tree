from rest_framework.serializers import ModelSerializer

from api_server.apps.chat.models import Room, Tweet


class RoomSerializer(ModelSerializer):
    """Room serializer"""

    class Meta:
        """Meta"""
        model = Room
        fields = '__all__'


class TweetSerializer(ModelSerializer):
    """Tweet serializer"""

    class Meta:
        """Meta"""
        model = Tweet
        fields = '__all__'
