from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Utilisateur


class InscriptionSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Utilisateur
        fields = ['prenom', 'nom', 'email', 'password', 'role', 'niveau']

    def validate(self, data):
        if data.get('role') == 'eleve' and not data.get('niveau'):
            raise serializers.ValidationError(
                {'niveau': "Le niveau est obligatoire pour un élève."}
            )
        if data.get('role') == 'enseignant':
            data['niveau'] = None
        return data

    def create(self, validated_data):
        return Utilisateur.objects.create_user(**validated_data)


class ConnexionSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError(
                {'detail': "Email ou mot de passe incorrect."}
            )
        if not user.is_active:
            raise serializers.ValidationError(
                {'detail': "Ce compte a été désactivé."}
            )
        data['user'] = user
        return data


class ProfilSerializer(serializers.ModelSerializer):
    nom_complet = serializers.ReadOnlyField()

    class Meta:
        model = Utilisateur
        fields = ['id', 'email', 'prenom', 'nom', 'nom_complet', 'role', 'niveau', 'date_inscription']
        read_only_fields = ['id', 'email', 'date_inscription']


def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }
