import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, Eye, EyeOff, User, AlertCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NIVEAUX = [
  { id: 'ce1', label: 'CE1', groupe: 'Primaire' },
  { id: 'ce2', label: 'CE2', groupe: 'Primaire' },
  { id: 'cm1', label: 'CM1', groupe: 'Primaire' },
  { id: 'cm2', label: 'CM2', groupe: 'Primaire' },
  { id: '6eme', label: '6ème', groupe: 'Collège' },
  { id: '5eme', label: '5ème', groupe: 'Collège' },
];

const RegisterPage = () => {
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'eleve',
    niveau: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (form.role === 'eleve' && !form.niveau) {
      setError('Veuillez sélectionner votre niveau scolaire.');
      return;
    }

    setLoading(true);
    try {
      await register({
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        password: form.password,
        role: form.role,
        niveau: form.role === 'eleve' ? form.niveau : null,
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Brain className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Tuteur Intelligent</h1>
          <p className="text-gray-500 mt-1">Crée ton compte et commence à apprendre</p>
        </div>

        {/* Carte */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Créer un compte</h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Type de compte */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Je suis
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'eleve', label: '🎒 Élève' },
                  { value: 'enseignant', label: '📋 Enseignant' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: opt.value })}
                    className={`py-3 rounded-xl font-semibold border-2 transition-all ${
                      form.role === opt.value
                        ? 'bg-indigo-500 text-white border-indigo-500 shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={form.prenom}
                    onChange={set('prenom')}
                    required
                    placeholder="Aminata"
                    className="w-full pl-9 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={set('nom')}
                  required
                  placeholder="Diallo"
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>

            {/* Niveau (élève seulement) */}
            {form.role === 'eleve' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  <GraduationCap size={15} className="inline mr-1" />
                  Niveau scolaire
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {NIVEAUX.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setForm({ ...form, niveau: n.id })}
                      className={`py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                        form.niveau === n.id
                          ? 'bg-indigo-500 text-white border-indigo-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      {n.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  required
                  placeholder="ton@email.com"
                  className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  required
                  placeholder="8 caractères minimum"
                  className="w-full pl-9 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirmer mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
