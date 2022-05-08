"""API views of chat app"""
import enum

from django.db import transaction
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from api_server.apps.chat.models import Room, Tweet
from api_server.apps.chat.serializers import RoomSerializer, TweetSerializer


class StandardPageNumberPagination(PageNumberPagination):
    """Standard pagination settings"""
    page_size = 10
    max_page_size = 200
    page_size_query_param = 'page_size'


class IsDeletedParam(enum.Enum):
    """parameter values of `is_deleted` query"""
    ONLY = 'only'
    ALL = 'all'


class OrderByParam(enum.Enum):
    """parameter value of `order_by` query"""
    ACTIVITY = 'activity'


class RoomViewSet(ModelViewSet):
    """Chat Room view set"""
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter by `is_deleted` flag"""
        queryset = Room.objects.all()

        # Filter by logical delete flag
        is_deleted_query = self.request.query_params.get('is_deleted')
        if is_deleted_query == IsDeletedParam.ONLY.value:
            queryset = queryset.filter(is_deleted=True)
        elif is_deleted_query == IsDeletedParam.ALL.value:
            pass
        else:
            queryset = queryset.filter(is_deleted=False)

        # Sort by activity
        order_by_query = self.request.query_params.get('order_by')
        print('ORDER_BY query:', order_by_query)
        if order_by_query == OrderByParam.ACTIVITY.value:
            print('ORDER_BY query found')
            queryset = queryset.order_by('-last_active_at')

        return queryset


class TweetViewSet(ModelViewSet):
    """Tweet view set"""
    queryset = Tweet.objects.all()
    serializer_class = TweetSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPageNumberPagination

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        room = serializer.validated_data['room']
        with transaction.atomic():
            self.perform_create(serializer)
            room.last_active_at = timezone.now()
            room.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        """Filter by room ID specified with query"""
        room_id = self.request.query_params.get('room_id')

        order_key = '-created_at'

        if not room_id:
            return Tweet.objects.all().order_by(order_key)

        return Tweet.objects.filter(room=room_id).order_by(order_key)
