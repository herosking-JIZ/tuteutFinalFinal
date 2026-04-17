from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Conversation, Message
from .serializers import (
    EnvoiMessageSerializer,
    ConversationSerializer,
    ConversationDetailSerializer,
)
from .services import appeler_gemini, GeminiIndisponible


class EnvoiMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EnvoiMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        message_texte = serializer.validated_data['message']
        conversation_id = serializer.validated_data.get('conversation_id')

        # Récupère ou crée la conversation
        conversation = None
        if conversation_id:
            try:
                conversation = Conversation.objects.get(
                    id=conversation_id,
                    utilisateur=request.user
                )
            except Conversation.DoesNotExist:
                return Response(
                    {'detail': "Conversation introuvable."},
                    status=status.HTTP_404_NOT_FOUND
                )

        if not conversation:
            conversation = Conversation.objects.create(
                utilisateur=request.user,
                titre=message_texte[:60],
            )

        # Construit l'historique pour Gemini (format attendu par l'API)
        historique = []
        for msg in conversation.messages.all():
            role_gemini = 'user' if msg.role == 'user' else 'model'
            historique.append({
                "role": role_gemini,
                "parts": [{"text": msg.contenu}]
            })

        # Appel Gemini
        try:
            reponse_ia = appeler_gemini(historique, message_texte)
        except GeminiIndisponible as e:
            return Response(
                {'detail': f"Le tuteur IA est temporairement indisponible : {e}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # Sauvegarde les deux messages
        Message.objects.create(conversation=conversation, role='user', contenu=message_texte)
        Message.objects.create(conversation=conversation, role='assistant', contenu=reponse_ia)

        return Response({
            'response': reponse_ia,
            'conversation_id': conversation.id,
        }, status=status.HTTP_200_OK)


class ListeConversationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        conversations = Conversation.objects.filter(utilisateur=request.user)
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)


class DetailConversationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            conversation = Conversation.objects.get(pk=pk, utilisateur=request.user)
        except Conversation.DoesNotExist:
            return Response(
                {'detail': "Conversation introuvable."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ConversationDetailSerializer(conversation)
        return Response(serializer.data)
