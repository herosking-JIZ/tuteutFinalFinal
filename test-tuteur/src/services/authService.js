const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const authService = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Identifiants incorrects');
    return data;
  },

  async register({ prenom, nom, email, password, role, niveau }) {
    const response = await fetch(`${API_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom, nom, email, password, role, niveau }),
    });
    const data = await response.json();
    if (!response.ok) {
      const firstError = Object.values(data)[0];
      throw new Error(Array.isArray(firstError) ? firstError[0] : firstError);
    }
    return data;
  },

  async refreshToken() {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('Pas de refresh token');
    const response = await fetch(`${API_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error('Session expirée');
    localStorage.setItem('access_token', data.access);
    return data.access;
  },
};

export default authService;
