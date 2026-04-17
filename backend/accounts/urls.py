from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import InscriptionView, ConnexionView, ProfilView

urlpatterns = [
    path('register/', InscriptionView.as_view(), name='register'),
    path('login/', ConnexionView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', ProfilView.as_view(), name='profil'),
]
