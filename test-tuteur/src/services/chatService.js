// frontend/src/services/chatService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ChatService {
  constructor() {
    this.conversationId = null;
  }
  
  async sendMessage(prompt, files = []) {
    const formData = new FormData();
    formData.append('prompt', prompt);
    
    // Ajouter fichiers
    files.forEach(file => {
      formData.append('files', file);
    });
    
    // Ajouter conversation ID si existe
    if (this.conversationId) {
      formData.append('conversation_id', this.conversationId);
    }
    
    try {
      const response = await fetch(`${API_URL}/chat/`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur serveur');
      }
      
      const data = await response.json();
      
      // Sauvegarder conversation ID
      if (data.conversation_id) {
        this.conversationId = data.conversation_id;
      }
      
      return data;
      
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
}
    resetConversation() {
    this.conversationId = null;
}
}

export default new ChatService();