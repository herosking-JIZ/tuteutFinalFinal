# Tuteur Intelligent — Documentation Complète

Application web de tutorat pédagogique avec intelligence artificielle, destinée aux élèves africains du primaire et du secondaire.

---

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Architecture technique](#2-architecture-technique)
3. [Structure des fichiers](#3-structure-des-fichiers)
4. [Prérequis](#4-prérequis)
5. [Installation](#5-installation)
6. [Configuration](#6-configuration)
7. [Lancement du projet](#7-lancement-du-projet)
8. [API — Référence complète](#8-api--référence-complète)
9. [Frontend — Guide des composants](#9-frontend--guide-des-composants)
10. [Base de données — Modèles](#10-base-de-données--modèles)
11. [Authentification JWT](#11-authentification-jwt)
12. [Intégration Gemini AI](#12-intégration-gemini-ai)
13. [Flux utilisateur complet](#13-flux-utilisateur-complet)
14. [Déploiement](#14-déploiement)
15. [Dépannage](#15-dépannage)

---

## 1. Présentation du projet

**Tuteur Intelligent** est une plateforme éducative qui permet aux élèves de :
- Apprendre des leçons par matière et par niveau
- Faire des exercices interactifs avec correction automatique
- Poser des questions à un tuteur IA (propulsé par Google Gemini)
- Suivre leur progression (scores par matière, série de jours)

**Utilisateurs cibles :** Élèves du CE1 au 5ème (Afrique subsaharienne, enseignement en français)

**Stack technique :**
- Backend : Django 4.x + Django REST Framework + JWT
- Frontend : React 19 + Tailwind CSS
- Base de données : MySQL 8
- IA : Google Gemini 2.0 Flash

---

## 2. Architecture technique

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVIGATEUR                            │
│                   React (localhost:3000)                      │
│                                                               │
│  LoginPage / RegisterPage ──► AuthContext ──► ProtectedRoute │
│                                    │                          │
│           TuteurIntelligent ◄──────┘                         │
│         (Accueil + Chat IA)                                   │
│                │                                              │
│          chatService.js ──► Authorization: Bearer <token>    │
└────────────────┼────────────────────────────────────────────┘
                 │ HTTP / JSON
┌────────────────▼────────────────────────────────────────────┐
│                  Django (localhost:8000)                      │
│                                                               │
│  /api/auth/  ──► accounts app (register, login, profil)      │
│  /api/chat/  ──► chat app (message, conversations)           │
│                       │                                       │
│              chat/services.py                                 │
└───────────────────────┼─────────────────────────────────────┘
                        │ HTTPS / JSON
┌───────────────────────▼─────────────────────────────────────┐
│              Google Gemini 2.0 Flash API                     │
│     generativelanguage.googleapis.com/v1beta/...             │
└─────────────────────────────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    MySQL 8 (tuteur_db)                        │
│   accounts_utilisateur │ chat_conversation │ chat_message    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Structure des fichiers

```
projetweb/web/
│
├── README.md                        ← Cette documentation
├── .gitignore
│
├── backend/                         ← Application Django
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env                         ← Variables d'environnement (non versionné)
│   ├── .env.example                 ← Modèle de configuration
│   │
│   ├── tuteur/                      ← Configuration Django principale
│   │   ├── settings.py              ← Paramètres (DB, JWT, CORS, Gemini)
│   │   ├── urls.py                  ← Routage principal
│   │   └── wsgi.py
│   │
│   ├── accounts/                    ← App authentification
│   │   ├── models.py                ← Modèle Utilisateur personnalisé
│   │   ├── serializers.py           ← Inscription, Connexion, Profil
│   │   ├── views.py                 ← InscriptionView, ConnexionView, ProfilView
│   │   ├── urls.py                  ← Routes /api/auth/
│   │   └── migrations/
│   │
│   └── chat/                        ← App chat IA
│       ├── models.py                ← Conversation, Message
│       ├── serializers.py           ← EnvoiMessage, Conversation, Detail
│       ├── views.py                 ← EnvoiMessage, ListeConversations, Detail
│       ├── services.py              ← Appel à l'API Gemini
│       ├── urls.py                  ← Routes /api/chat/
│       └── migrations/
│
└── test-tuteur/                     ← Application React
    ├── package.json
    │
    └── src/
        ├── App.js                   ← Routeur principal
        │
        ├── context/
        │   └── AuthContext.jsx      ← État global auth (login, logout, token)
        │
        ├── services/
        │   ├── authService.js       ← Appels API auth (login, register, refresh)
        │   └── chatService.js       ← Appels API chat (sendMessage, reset)
        │
        ├── components/
        │   ├── ProtectedRoute.jsx   ← Garde les routes privées
        │   └── TuteurIntelligent.jsx ← Interface principale (accueil + chat)
        │
        └── pages/
            ├── LoginPage.jsx        ← Formulaire de connexion
            └── RegisterPage.jsx     ← Formulaire d'inscription
```

---

## 4. Prérequis

| Outil | Version minimale | Vérification |
|-------|-----------------|--------------|
| Python | 3.10+ | `python --version` |
| Node.js | 18+ | `node --version` |
| MySQL | 8.0+ | `mysql --version` |
| npm | 9+ | `npm --version` |

**Comptes nécessaires :**
- Compte Google pour obtenir une clé API Gemini : [aistudio.google.com](https://aistudio.google.com/app/apikey)

---

## 5. Installation

### 5.1 Cloner le projet

```bash
git clone <url-du-repo>
cd projetweb/web
```

### 5.2 Backend — Python

```bash
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer (Windows PowerShell)
venv\Scripts\activate

# Activer (macOS / Linux)
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### 5.3 Frontend — Node.js

```bash
cd test-tuteur
npm install
```

### 5.4 Base de données MySQL

Créer la base de données dans MySQL Workbench ou terminal MySQL :

```sql
CREATE DATABASE tuteur_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 6. Configuration

### 6.1 Fichier `.env` (backend)

Copier le modèle et le remplir :

```bash
cp backend/.env.example backend/.env
```

Contenu du fichier `backend/.env` :

```env
# Clé secrète Django (générer une longue chaîne aléatoire)
SECRET_KEY=une-cle-secrete-longue-et-aleatoire-ici

# Mode développement
DEBUG=True

# Clé API Google Gemini (obtenir sur aistudio.google.com)
GEMINI_API_KEY=AIzaSy...

# Base de données MySQL
DB_NAME=tuteur_db
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=3306
```

> **Note :** Si `DB_NAME` est laissé vide, Django utilisera automatiquement SQLite (pratique pour tester rapidement sans MySQL).

### 6.2 Frontend — URL de l'API

Par défaut le frontend pointe vers `http://localhost:8000/api`. Pour changer :

Créer `test-tuteur/.env` :
```env
REACT_APP_API_URL=http://localhost:8000/api
```

---

## 7. Lancement du projet

### Terminal 1 — Backend

```bash
cd backend
venv\Scripts\activate          # Windows
# ou: source venv/bin/activate  # macOS/Linux

python manage.py makemigrations accounts
python manage.py makemigrations chat
python manage.py migrate
python manage.py runserver
```

Le backend est disponible sur **http://localhost:8000**

### Terminal 2 — Frontend

```bash
cd test-tuteur
npm start
```

L'application est disponible sur **http://localhost:3000**

### Créer un compte administrateur (optionnel)

```bash
cd backend
python manage.py createsuperuser
```

Interface admin : **http://localhost:8000/admin/**

---

## 8. API — Référence complète

### Authentification

#### POST `/api/auth/register/`
Créer un nouveau compte.

**Body JSON :**
```json
{
  "prenom": "Aminata",
  "nom": "Diallo",
  "email": "aminata@example.com",
  "password": "motdepasse123",
  "role": "eleve",
  "niveau": "cm2"
}
```

**Valeurs `role` :** `eleve` | `enseignant`

**Valeurs `niveau` (obligatoire si élève) :** `ce1` | `ce2` | `cm1` | `cm2` | `6eme` | `5eme`

**Réponse 201 :**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIs...",
  "refresh": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

#### POST `/api/auth/login/`
Se connecter.

**Body JSON :**
```json
{
  "email": "aminata@example.com",
  "password": "motdepasse123"
}
```

**Réponse 200 :**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIs...",
  "refresh": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

#### POST `/api/auth/token/refresh/`
Renouveler le token d'accès.

**Body JSON :**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Réponse 200 :**
```json
{
  "access": "nouveau_token..."
}
```

---

#### GET `/api/auth/me/`
Récupérer le profil de l'utilisateur connecté.

**Header requis :** `Authorization: Bearer <access_token>`

**Réponse 200 :**
```json
{
  "id": 1,
  "email": "aminata@example.com",
  "prenom": "Aminata",
  "nom": "Diallo",
  "nom_complet": "Aminata Diallo",
  "role": "eleve",
  "niveau": "cm2",
  "date_inscription": "2026-04-17T20:00:00Z"
}
```

---

### Chat IA

#### POST `/api/chat/message/`
Envoyer un message au tuteur IA.

**Header requis :** `Authorization: Bearer <access_token>`

**Body JSON :**
```json
{
  "message": "Explique-moi les fractions",
  "conversation_id": null
}
```

> Envoyer `conversation_id: null` pour démarrer une nouvelle conversation. Réutiliser l'ID retourné pour continuer la même conversation.

**Réponse 200 :**
```json
{
  "response": "Bien sûr ! Une fraction représente une partie d'un tout...",
  "conversation_id": 42
}
```

---

#### GET `/api/chat/conversations/`
Lister toutes les conversations de l'utilisateur.

**Header requis :** `Authorization: Bearer <access_token>`

**Réponse 200 :**
```json
[
  {
    "id": 42,
    "titre": "Explique-moi les fractions",
    "created_at": "2026-04-17T22:00:00Z",
    "nombre_messages": 6
  }
]
```

---

#### GET `/api/chat/conversations/<id>/messages/`
Récupérer l'historique complet d'une conversation.

**Header requis :** `Authorization: Bearer <access_token>`

**Réponse 200 :**
```json
{
  "id": 42,
  "titre": "Explique-moi les fractions",
  "created_at": "2026-04-17T22:00:00Z",
  "messages": [
    {
      "id": 1,
      "role": "user",
      "contenu": "Explique-moi les fractions",
      "timestamp": "2026-04-17T22:00:01Z"
    },
    {
      "id": 2,
      "role": "assistant",
      "contenu": "Bien sûr ! Une fraction...",
      "timestamp": "2026-04-17T22:00:03Z"
    }
  ]
}
```

---

## 9. Frontend — Guide des composants

### `AuthContext.jsx`
Contexte React global qui gère l'état d'authentification.

**Expose :**
| Valeur | Type | Description |
|--------|------|-------------|
| `user` | Object | Payload du token JWT (id, email, etc.) |
| `token` | String | Access token JWT |
| `isAuthenticated` | Boolean | `true` si token valide et non expiré |
| `loading` | Boolean | `true` pendant la vérification initiale |
| `login(email, password)` | Function | Connecte l'utilisateur et stocke les tokens |
| `register(formData)` | Function | Inscrit l'utilisateur et connecte automatiquement |
| `logout()` | Function | Supprime les tokens et déconnecte |

**Utilisation :**
```jsx
import { useAuth } from '../context/AuthContext';

const { user, isAuthenticated, logout } = useAuth();
```

---

### `authService.js`
Couche d'accès à l'API d'authentification.

| Méthode | Description |
|---------|-------------|
| `authService.login(email, password)` | POST /api/auth/login/ |
| `authService.register({prenom, nom, email, password, role, niveau})` | POST /api/auth/register/ |
| `authService.refreshToken()` | POST /api/auth/token/refresh/ |

---

### `chatService.js`
Couche d'accès à l'API chat. Singleton qui mémorise le `conversation_id` courant.

| Méthode | Description |
|---------|-------------|
| `chatService.sendMessage(message)` | POST /api/chat/message/ avec JWT |
| `chatService.resetConversation()` | Remet `conversation_id` à null (nouvelle conversation) |

**Comportement automatique :**
- Lit le token depuis `localStorage.getItem('access_token')`
- Si réponse 401 → supprime les tokens et redirige vers `/login`

---

### `ProtectedRoute.jsx`
Composant garde pour les routes privées.

- Affiche un spinner pendant le chargement
- Redirige vers `/login` si non authentifié
- Laisse passer vers la page enfant si authentifié

---

### `TuteurIntelligent.jsx`
Interface principale. Gère 4 vues internes :

| Vue | Déclencheur | Description |
|-----|-------------|-------------|
| `home` | Par défaut | Tableau de bord + choix de matière |
| `selectLevel` | Clic matière | Sélection du niveau scolaire |
| `lesson` | Clic niveau | Affichage de la leçon |
| `chat` | Bouton "Chat IA" | Interface de chat avec Gemini |

---

## 10. Base de données — Modèles

### `Utilisateur` (accounts)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | BigInt (PK) | Identifiant auto |
| `email` | EmailField (unique) | Identifiant de connexion |
| `prenom` | CharField(100) | Prénom |
| `nom` | CharField(100) | Nom de famille |
| `role` | CharField | `eleve` ou `enseignant` |
| `niveau` | CharField | Niveau scolaire (nullable pour enseignants) |
| `date_inscription` | DateTimeField | Date de création du compte |
| `is_active` | Boolean | Compte actif |
| `is_staff` | Boolean | Accès à l'admin Django |

---

### `Conversation` (chat)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | BigInt (PK) | Identifiant auto |
| `utilisateur` | FK → Utilisateur | Propriétaire de la conversation |
| `titre` | CharField(255) | Généré automatiquement depuis le 1er message |
| `created_at` | DateTimeField | Date de création |

---

### `Message` (chat)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | BigInt (PK) | Identifiant auto |
| `conversation` | FK → Conversation | Conversation parente |
| `role` | CharField | `user` ou `assistant` |
| `contenu` | TextField | Texte du message |
| `timestamp` | DateTimeField | Date d'envoi |

---

## 11. Authentification JWT

Le projet utilise **djangorestframework-simplejwt**.

**Durée de vie des tokens :**
- Access token : **60 minutes**
- Refresh token : **7 jours**

**Flux complet :**
```
1. POST /api/auth/login/  →  { access, refresh }
2. Stocker dans localStorage
3. Chaque requête API  →  Header: Authorization: Bearer <access>
4. Token expiré (401)  →  POST /api/auth/token/refresh/ avec refresh
5. Nouveau access token stocké  →  Requête relancée
6. Refresh expiré  →  Redirection vers /login
```

**Sécurité :**
- Les tokens sont stockés dans `localStorage`
- Le payload du token contient : `user_id`, `exp`, `iat`
- `AUTH_USER_MODEL` pointe vers le modèle `Utilisateur` personnalisé

---

## 12. Intégration Gemini AI

### Configuration

```python
# backend/tuteur/settings.py
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
GEMINI_SYSTEM_PROMPT = "Tu es un tuteur pédagogique bienveillant..."
```

### Fonctionnement

Chaque appel à `/api/chat/message/` :
1. Récupère l'historique complet de la conversation depuis la BDD
2. Construit la liste `contents` (format Gemini : `role: user/model`)
3. Envoie à l'API Gemini avec le `systemInstruction`
4. Sauvegarde le message utilisateur + la réponse en BDD
5. Retourne la réponse au frontend

### Paramètres Gemini

```python
"generationConfig": {
    "temperature": 0.7,      # Créativité modérée
    "maxOutputTokens": 1024  # Réponses de taille raisonnable
}
```

### Obtenir une clé API Gemini valide

1. Aller sur [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Se connecter avec un compte Google
3. Cliquer **"Create API key"**
4. La clé commence par `AIzaSy...`
5. La coller dans `backend/.env` : `GEMINI_API_KEY=AIzaSy...`

---

## 13. Flux utilisateur complet

```
Ouverture de l'app (localhost:3000)
        │
        ▼
AuthContext vérifie localStorage
        │
        ├── Token absent ou expiré ──► /login
        │                                 │
        │                         Formulaire email/password
        │                                 │
        │                         POST /api/auth/login/
        │                                 │
        │                         Tokens stockés en localStorage
        │
        └── Token valide ──► / (ProtectedRoute → TuteurIntelligent)
                                         │
                              ┌──────────┴──────────┐
                              │                     │
                         Vue Accueil           Vue Chat IA
                              │                     │
                    Choisir matière          Taper un message
                              │                     │
                    Choisir niveau        chatService.sendMessage()
                              │                     │
                    Lire la leçon       POST /api/chat/message/
                              │          (avec Authorization: Bearer)
                    Faire exercices               │
                              │          Django → Gemini API
                         Score +/-                │
                                         Réponse affichée
```

---

## 14. Déploiement

### Backend (exemple : Railway / Render)

1. Définir les variables d'environnement sur la plateforme :
   ```
   SECRET_KEY=...
   DEBUG=False
   GEMINI_API_KEY=...
   DB_NAME=...
   DB_USER=...
   DB_PASSWORD=...
   DB_HOST=...
   DB_PORT=...
   ALLOWED_HOSTS=votre-domaine.com
   ```

2. Ajouter dans `settings.py` pour la production :
   ```python
   ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost').split(',')
   CORS_ALLOWED_ORIGINS = ['https://votre-frontend.vercel.app']
   ```

3. Commandes de démarrage :
   ```bash
   python manage.py migrate
   python manage.py collectstatic --noinput
   gunicorn tuteur.wsgi:application
   ```

### Frontend (Vercel)

1. Connecter le repo GitHub à Vercel
2. Définir la variable d'environnement :
   ```
   REACT_APP_API_URL=https://votre-backend.railway.app/api
   ```
3. Vercel détecte automatiquement React et lance `npm run build`

---

## 15. Dépannage

### `Can't connect to server on 'localhost'`
MySQL n'est pas démarré.
```powershell
net start MySQL80
```

### `Unknown database 'tuteur_db'`
La base de données n'existe pas encore.
```sql
CREATE DATABASE tuteur_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### `No module named 'dotenv'`
```bash
pip install python-dotenv
```

### Erreur Gemini 404 — modèle introuvable
Le nom du modèle a changé. Vérifier dans `settings.py` :
```python
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
```

### Erreur Gemini 429 — quota dépassé
Limite du tier gratuit atteinte. Attendre quelques minutes ou créer une nouvelle clé API sur [aistudio.google.com](https://aistudio.google.com).

### Erreur Gemini 400/403 — clé invalide
La clé API n'est pas une clé Google AI Studio valide (doit commencer par `AIzaSy...`).

### Token JWT expiré — erreur 401
Le `chatService.js` redirige automatiquement vers `/login`. Se reconnecter.

### `CORS error` dans le navigateur
Vérifier dans `settings.py` que l'origine du frontend est bien dans `CORS_ALLOWED_ORIGINS` :
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
```

---

## Commandes de référence rapide

```bash
# Backend
python manage.py runserver          # Lancer le serveur
python manage.py makemigrations     # Créer les migrations
python manage.py migrate            # Appliquer les migrations
python manage.py createsuperuser    # Créer un admin
python manage.py shell              # Console Django interactive

# Frontend
npm start                           # Lancer en développement
npm run build                       # Build de production
npm install <package>               # Ajouter une dépendance
```
