from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenRefreshView

from .serializers import InscriptionSerializer, ConnexionSerializer, ProfilSerializer, get_tokens


class InscriptionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = InscriptionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        return Response(get_tokens(user), status=status.HTTP_201_CREATED)


class ConnexionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ConnexionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(get_tokens(serializer.validated_data['user']), status=status.HTTP_200_OK)


class ProfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(ProfilSerializer(request.user).data)
