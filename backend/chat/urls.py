from django.urls import path
from .views import EnvoiMessageView, ListeConversationsView, DetailConversationView

urlpatterns = [
    path('message/', EnvoiMessageView.as_view(), name='chat_message'),
    path('conversations/', ListeConversationsView.as_view(), name='conversations_liste'),
    path('conversations/<int:pk>/messages/', DetailConversationView.as_view(), name='conversation_detail'),
]
