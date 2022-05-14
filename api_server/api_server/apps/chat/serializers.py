from rest_framework.serializers import ModelSerializer

from api_server.apps.chat.models import Room, Tweet, Mark


class RoomSerializer(ModelSerializer):
    """Room serializer"""

    class Meta:
        """Meta"""
        model = Room
        fields = '__all__'


class MarkSerializer(ModelSerializer):
    """Mark serializer"""

    class Meta:
        """Meta"""
        model = Mark
        fields = '__all__'


class TweetSerializer(ModelSerializer):
    """Tweet serializer"""
    marks = MarkSerializer(many=True, required=False)

    class Meta:
        """Meta"""
        model = Tweet
        fields = '__all__'
        extra_fields = ['marks']
