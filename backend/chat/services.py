import requests
from django.conf import settings


def appeler_gemini(historique: list[dict], message_utilisateur: str) -> str:
    """
    Appelle l'API Gemini 1.5 Flash avec l'historique de la conversation.

    historique : liste de dicts {"role": "user"|"model", "parts": [{"text": "..."}]}
    message_utilisateur : le nouveau message à envoyer

    Retourne la réponse textuelle de Gemini.
    Lève une exception GeminiIndisponible si l'API est inaccessible.
    """
    if not settings.GEMINI_API_KEY:
        raise GeminiIndisponible("La clé GEMINI_API_KEY n'est pas configurée.")

    # Construit le contenu : historique + nouveau message
    contents = historique + [
        {"role": "user", "parts": [{"text": message_utilisateur}]}
    ]

    payload = {
        "contents": contents,
        "systemInstruction": {
            "parts": [{"text": settings.GEMINI_SYSTEM_PROMPT}]
        },
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1024,
        },
    }

    try:
        response = requests.post(
            settings.GEMINI_API_URL,
            headers={"Content-Type": "application/json"},
            params={"key": settings.GEMINI_API_KEY},
            json=payload,
            timeout=30,
        )
    except requests.exceptions.ConnectionError:
        raise GeminiIndisponible("Impossible de joindre l'API Gemini. Vérifiez votre connexion.")
    except requests.exceptions.Timeout:
        raise GeminiIndisponible("L'API Gemini a mis trop de temps à répondre.")

    if response.status_code != 200:
        raise GeminiIndisponible(
            f"Erreur Gemini ({response.status_code}) : {response.text[:200]}"
        )

    try:
        data = response.json()
        return data['candidates'][0]['content']['parts'][0]['text']
    except (KeyError, IndexError, ValueError) as e:
        raise GeminiIndisponible(f"Réponse Gemini inattendue : {e}")


class GeminiIndisponible(Exception):
    pass
