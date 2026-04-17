from django.contrib import admin
from .models import Conversation, Message


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ['role', 'contenu', 'timestamp']


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['id', 'utilisateur', 'titre', 'created_at']
    list_filter = ['created_at']
    search_fields = ['utilisateur__email', 'titre']
    inlines = [MessageInline]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'conversation', 'role', 'contenu_court', 'timestamp']
    list_filter = ['role', 'timestamp']

    def contenu_court(self, obj):
        return obj.contenu[:80]
    contenu_court.short_description = 'Contenu'
