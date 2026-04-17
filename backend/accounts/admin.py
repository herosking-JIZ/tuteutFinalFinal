from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Utilisateur


@admin.register(Utilisateur)
class UtilisateurAdmin(UserAdmin):
    model = Utilisateur
    list_display = ['email', 'prenom', 'nom', 'role', 'niveau', 'is_active', 'date_inscription']
    list_filter = ['role', 'niveau', 'is_active']
    ordering = ['-date_inscription']
    search_fields = ['email', 'prenom', 'nom']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informations personnelles', {'fields': ('prenom', 'nom', 'role', 'niveau')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'prenom', 'nom', 'role', 'niveau', 'password1', 'password2'),
        }),
    )
    readonly_fields = ['date_inscription']
