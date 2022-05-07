# Create your views here.
from rest_framework import permissions
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ModelViewSet

from api_server.apps.chat.models import Room, Tweet
from api_server.apps.chat.serializers import RoomSerializer, TweetSerializer


class StandardPageNumberPagination(PageNumberPagination):
    """Standard pagination settings"""
    page_size = 10
    max_page_size = 200
    page_size_query_param = 'page_size'


class RoomViewSet(ModelViewSet):
    """Chat Room view set"""
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter by `is_deleted` flag"""
        queryset = Room.objects.all()
        is_deleted_query = self.request.query_params.get('is_deleted')
        if is_deleted_query == 'only':
            queryset = queryset.filter(is_deleted=True)
        elif is_deleted_query == 'all':
            pass
        else:
            queryset = queryset.filter(is_deleted=False)

        return queryset


class TweetViewSet(ModelViewSet):
    """Tweet view set"""
    queryset = Tweet.objects.all()
    serializer_class = TweetSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPageNumberPagination

    def get_queryset(self):
        """Filter by room ID specified with query"""
        room_id = self.request.query_params.get('room_id')

        order_key = '-created_at'

        if not room_id:
            return Tweet.objects.all().order_by(order_key)
        else:
            return Tweet.objects.filter(room=room_id).order_by(order_key)
