const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ChatService {
  constructor() {
    this.conversationId = null;
  }

  async sendMessage(message) {
    const body = { message };
    if (this.conversationId) {
      body.conversation_id = this.conversationId;
    }

    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/chat/message/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      throw new Error('Session expirée, veuillez vous reconnecter.');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || error.error || 'Erreur serveur');
    }

    const data = await response.json();

    if (data.conversation_id) {
      this.conversationId = data.conversation_id;
    }

    return data;
  }

  resetConversation() {
    this.conversationId = null;
  }
}

export default new ChatService();
