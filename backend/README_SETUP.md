# Guide d'installation — Backend Tuteur Intelligent

## Prérequis
- Python 3.10+
- MySQL 8+ (ou SQLite pour les tests rapides)
- Une clé API Google Gemini (https://aistudio.google.com/app/apikey)

---

## Étape 1 — Créer et activer le virtualenv

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

---

## Étape 2 — Installer les dépendances

```bash
pip install -r requirements.txt
```

> Si l'installation de `mysqlclient` échoue sur Windows, installe d'abord :
> `pip install mysqlclient` depuis https://www.lfd.uci.edu/~gohlke/pythonlibs/#mysqlclient
> ou utilise SQLite (voir Étape 3).

---

## Étape 3 — Configurer les variables d'environnement

```bash
cp .env.example .env
```

Ouvre `.env` et remplis :

```env
SECRET_KEY=une-cle-secrete-longue-et-aleatoire
DEBUG=True
GEMINI_API_KEY=ta_cle_api_gemini_ici

# MySQL (laisse vide pour utiliser SQLite automatiquement)
DB_NAME=tuteur_db
DB_USER=root
DB_PASSWORD=ton_mot_de_passe
DB_HOST=localhost
DB_PORT=3306
```

> Pour utiliser SQLite (plus simple en développement), laisse `DB_NAME` vide dans le `.env`.

---

## Étape 4 — Créer la base de données MySQL

Si tu utilises MySQL :

```sql
-- Dans ton client MySQL (MySQL Workbench, DBeaver, ou terminal)
CREATE DATABASE tuteur_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Étape 5 — Lancer les migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Étape 6 — Créer un superutilisateur (accès admin)

```bash
python manage.py createsuperuser
```

Renseigne email, prénom, nom et mot de passe.

---

## Étape 7 — Lancer le serveur

```bash
python manage.py runserver
```

Le backend est disponible sur : **http://localhost:8000**

---

## Endpoints disponibles

| Méthode | URL | Auth | Description |
|---------|-----|------|-------------|
| POST | `/api/auth/register/` | Non | Créer un compte |
| POST | `/api/auth/login/` | Non | Se connecter |
| POST | `/api/auth/token/refresh/` | Non | Rafraîchir le token |
| GET | `/api/auth/me/` | JWT | Profil utilisateur |
| POST | `/api/chat/message/` | JWT | Envoyer un message au tuteur IA |
| GET | `/api/chat/conversations/` | JWT | Lister ses conversations |
| GET | `/api/chat/conversations/<id>/messages/` | JWT | Historique d'une conversation |

## Interface d'administration

Accède à **http://localhost:8000/admin/** avec les identifiants du superutilisateur.

---

## Test rapide avec curl

```bash
# 1. Créer un compte
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"prenom":"Aminata","nom":"Diallo","email":"test@test.com","password":"motdepasse123","role":"eleve","niveau":"cm2"}'

# 2. Copier le token "access" de la réponse, puis tester le chat
curl -X POST http://localhost:8000/api/chat/message/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ton_access_token>" \
  -d '{"message":"Explique-moi les fractions","conversation_id":null}'
```
