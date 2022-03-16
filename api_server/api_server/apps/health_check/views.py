"""health check app views"""

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthCheckView(APIView):
    """Health check view"""

    def get(self, _request):
        """Health check"""
        return Response(data={'message': 'I am healthy.'}, status=status.HTTP_200_OK)
