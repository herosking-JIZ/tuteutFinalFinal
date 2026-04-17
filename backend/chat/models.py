from django.db import models
from django.conf import settings


class Conversation(models.Model):
    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='conversations'
    )
    titre = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Conv #{self.id} — {self.utilisateur.email}"

    def save(self, *args, **kwargs):
        # Génère un titre automatique à partir du premier message si vide
        if not self.titre:
            self.titre = f"Conversation du {self.created_at.strftime('%d/%m/%Y') if self.created_at else ''}"
        super().save(*args, **kwargs)


class Message(models.Model):
    ROLE_CHOICES = [
        ('user', 'Utilisateur'),
        ('assistant', 'Assistant'),
    ]

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    contenu = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"[{self.role}] Conv #{self.conversation_id} — {self.contenu[:50]}"
