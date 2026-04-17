from rest_framework import serializers
from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'role', 'contenu', 'timestamp']


class ConversationSerializer(serializers.ModelSerializer):
    nombre_messages = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'titre', 'created_at', 'nombre_messages']

    def get_nombre_messages(self, obj):
        return obj.messages.count()


class ConversationDetailSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'titre', 'created_at', 'messages']


class EnvoiMessageSerializer(serializers.Serializer):
    message = serializers.CharField(min_length=1)
    conversation_id = serializers.IntegerField(required=False, allow_null=True)
