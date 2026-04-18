import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Brain, Trophy, TrendingUp, CheckCircle, XCircle, BarChart3, Star, MessageCircle, Send, X, FileText, Image, Loader, Bot, User, Home, LogOut } from 'lucide-react';
import chatService from '../services/chatService';
import { useAuth } from '../context/AuthContext';

const TuteurIntelligent = () => {
  const { logout } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [exerciseMode, setExerciseMode] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  
  // État du Chat IA
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const [studentProgress, setStudentProgress] = useState({
    mathsScore: 75,
    francaisScore: 82,
    sciencesScore: 68,
    totalExercises: 45,
    streak: 7
  });

  // Données des matières et niveaux
  const subjects = [
    { id: 'maths', name: 'Mathématiques', icon: '🔢', color: 'bg-blue-500' },
    { id: 'francais', name: 'Français', icon: '📚', color: 'bg-green-500' },
    { id: 'sciences', name: 'Sciences', icon: '🔬', color: 'bg-purple-500' },
    { id: 'histoire', name: 'Histoire', icon: '🏛️', color: 'bg-orange-500' }
  ];

  const levels = [
    { id: 'ce1', name: 'CE1', grade: 'Primaire' },
    { id: 'ce2', name: 'CE2', grade: 'Primaire' },
    { id: 'cm1', name: 'CM1', grade: 'Primaire' },
    { id: 'cm2', name: 'CM2', grade: 'Primaire' },
    { id: '6eme', name: '6ème', grade: 'Collège' },
    { id: '5eme', name: '5ème', grade: 'Collège' }
  ];

  // Base de connaissances avec leçons
  const lessons = {
    maths: {
      ce2: {
        title: 'Les Fractions - Introduction',
        content: `Une fraction représente une partie d'un tout divisé en parts égales.

🔹 La fraction se compose de deux nombres :
  • Le numérateur (en haut) : le nombre de parts prises
  • Le dénominateur (en bas) : le nombre total de parts

Exemple : 3/4 signifie "3 parts sur 4 parts au total"

Imagine une pizza coupée en 4 parts égales. Si tu manges 3 parts, tu as mangé 3/4 de la pizza.

💡 Astuce : Le dénominateur te dit en combien de morceaux le tout est divisé. Le numérateur te dit combien de morceaux tu prends.`,
        exercises: [
          {
            question: "Si une tarte est coupée en 8 parts et que tu en manges 3, quelle fraction as-tu mangée ?",
            options: ["3/8", "8/3", "3/5", "5/8"],
            correct: "3/8",
            explanation: "Tu as mangé 3 parts sur un total de 8 parts, donc 3/8 de la tarte."
          },
          {
            question: "Dans la fraction 5/6, quel est le dénominateur ?",
            options: ["5", "6", "11", "1"],
            correct: "6",
            explanation: "Le dénominateur est le nombre en bas de la fraction, ici c'est 6."
          },
          {
            question: "Si un gâteau est divisé en 10 parts égales et que j'en prends 7, combien de parts restent ?",
            options: ["3", "7", "10", "17"],
            correct: "3",
            explanation: "Il reste 10 - 7 = 3 parts. J'ai pris 7/10 du gâteau."
          }
        ]
      },
      cm1: {
        title: 'La Multiplication - Tables avancées',
        content: `La multiplication est une addition répétée.\n\n🔹 Tables de 6 à 9 :\n   • 6 × 7 = 42\n   • 7 × 8 = 56\n   • 8 × 9 = 72\n\n💡 Astuce pour la table de 9 :\nPour 9 × 6, baisse ton 6ème doigt.\nÀ gauche = dizaines (5), à droite = unités (4)\nRésultat : 54!`,
        exercises: [
          {
            question: "Combien font 7 × 8 ?",
            options: ["54", "56", "63", "64"],
            correct: "56",
            explanation: "7 × 8 = 56. Astuce : (7 × 10) - (7 × 2) = 70 - 14 = 56"
          },
          {
            question: "Si j'ai 6 sachets de 9 bonbons chacun, combien de bonbons ai-je en tout ?",
            options: ["45", "54", "63", "72"],
            correct: "54",
            explanation: "6 × 9 = 54 bonbons au total."
          }
        ]
      }
    },
    francais: {
      ce2: {
        title: 'Le Pluriel des Noms',
        content: `Pour former le pluriel des noms, on ajoute généralement un "s".\n\n🔹 Règle générale :\n   • un chat → des chats\n   • une table → des tables\n\n📊 Cas particuliers :\n   • -eau, -au, -eu → +x : bateau → bateaux\n   • -al → -aux : cheval → chevaux\n   • -ou → +s (sauf 7 exceptions)\n\n💡 Les 7 noms en -ou qui prennent x :\nbijou, caillou, chou, genou, hibou, joujou, pou`,
        exercises: [
          {
            question: "Quel est le pluriel de 'oiseau' ?",
            options: ["oiseaus", "oiseaux", "oiseauxs", "oiseau"],
            correct: "oiseaux",
            explanation: "Les noms en -eau prennent un 'x' au pluriel : oiseau → oiseaux"
          },
          {
            question: "Quel est le pluriel de 'journal' ?",
            options: ["journals", "journaux", "journals", "journalx"],
            correct: "journaux",
            explanation: "Les noms en -al se transforment en -aux au pluriel : journal → journaux"
          }
        ]
      }
    },
    sciences: {
      cm1: {
        title: 'Le Cycle de l\'Eau',
        content: `L'eau sur Terre effectue un cycle permanent.\n\n🔹 Les étapes :\n   1. Évaporation\n   2. Condensation\n   3. Précipitation\n   4. Ruissellement`,
        exercises: [
          {
            question: "Comment s'appelle la transformation de l'eau liquide en vapeur ?",
            options: ["Condensation", "Évaporation", "Précipitation", "Ruissellement"],
            correct: "Évaporation",
            explanation: "L'évaporation est le passage de l'eau de l'état liquide à l'état gazeux."
          },
          {
            question: "Que forment les gouttelettes d'eau dans le ciel ?",
            options: ["Des nuages", "De la pluie", "De la glace", "Du vent"],
            correct: "Des nuages",
            explanation: "La vapeur d'eau se condense en gouttelettes qui forment les nuages."
          }
        ]
      }
    }
  };

  // Message d'accueil chat (une seule fois)
  useEffect(() => {
    if (currentView === 'chat' && chatMessages.length === 0) {
      setChatMessages([{
        role: 'assistant',
        content: "Salut ! Je suis ton tuteur IA. Je peux t'aider à comprendre tes cours, résoudre des exercices, ou expliquer des concepts difficiles. Comment puis-je t'aider aujourd'hui ?",
        timestamp: new Date()
      }]);
    }
  }, [currentView, chatMessages.length]);

  // Scroll automatique vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Fonctions du Chat IA
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const messageTexte = chatInput;
    setChatMessages(prev => [...prev, {
      role: 'user',
      content: messageTexte,
      timestamp: new Date()
    }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const data = await chatService.sendMessage(messageTexte);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ ${error.message}`,
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const formatChatMessage = (content) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        return <h3 key={i} className="text-xl font-bold mt-4 mb-2">{line.substring(2)}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h4 key={i} className="text-lg font-bold mt-3 mb-2">{line.substring(3)}</h4>;
      }
      if (line.trim().match(/^[\d]+\./)) {
        return <li key={i} className="ml-4">{line.substring(line.indexOf('.') + 1)}</li>;
      }
      if (line.trim().startsWith('- ')) {
        return <li key={i} className="ml-4">• {line.substring(2)}</li>;
      }
      let formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  // Fonctions des exercices
  const analyzePerformance = (correct, subject) => {
    if (correct) {
      setStudentProgress(prev => ({
        ...prev,
        [`${subject}Score`]: Math.min(100, prev[`${subject}Score`] + 2),
        totalExercises: prev.totalExercises + 1
      }));
    } else {
      setStudentProgress(prev => ({
        ...prev,
        [`${subject}Score`]: Math.max(0, prev[`${subject}Score`] - 1)
      }));
    }
  };

  const handleAnswerSubmit = () => {
    const lesson = lessons[selectedSubject]?.[selectedLevel];
    if (!lesson) return;

    const exercise = lesson.exercises[currentExercise];
    const isCorrect = userAnswer === exercise.correct;
    
    setFeedbackCorrect(isCorrect);
    setShowFeedback(true);
    setAttempts(attempts + 1);
    
    if (isCorrect) {
      setScore(score + 1);
      analyzePerformance(true, selectedSubject);
    } else {
      analyzePerformance(false, selectedSubject);
    }
  };

  const nextExercise = () => {
    const lesson = lessons[selectedSubject]?.[selectedLevel];
    if (currentExercise < lesson.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setShowFeedback(false);
    } else {
      setExerciseMode(false);
      setCurrentExercise(0);
      alert(`Bravo ! Tu as terminé avec un score de ${score}/${lesson.exercises.length} 🎉`);
    }
  };

  const startExercises = () => {
    setExerciseMode(true);
    setScore(0);
    setAttempts(0);
    setCurrentExercise(0);
    setUserAnswer('');
    setShowFeedback(false);
  };

  // NAVIGATION SIMPLIFIÉE (2 boutons seulement)
  const MainNavigation = () => {
    // Ne pas afficher la navigation dans les vues intermédiaires
    if (currentView === 'selectLevel' || currentView === 'lesson' || exerciseMode) {
      return null;
    }

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50">
        <div className="max-w-6xl mx-auto flex justify-around items-center py-3">
          <button
            onClick={() => {
              setCurrentView('home');
              setExerciseMode(false);
              setSelectedSubject(null);
              setSelectedLevel(null);
            }}
            className={`flex flex-col items-center gap-1 px-8 py-2 rounded-lg transition-all ${
              currentView === 'home' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Home size={28} />
            <span className="text-sm font-semibold">Accueil</span>
          </button>

          <button
            onClick={() => setCurrentView('chat')}
            className={`flex flex-col items-center gap-1 px-8 py-2 rounded-lg transition-all ${
              currentView === 'chat' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageCircle size={28} />
            <span className="text-sm font-semibold">Chat IA</span>
          </button>
        </div>
      </div>
    );
  };

  // VUE CHAT IA
  if (currentView === 'chat') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 pb-20">
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header Chat */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white p-3 rounded-xl">
                  <Brain className="text-purple-600" size={28} />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">Tuteur IA</h1>
                  <p className="text-purple-100">Pose tes questions ou envoie tes documents !</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="p-6 h-[500px] overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.role === 'user' ? 'bg-indigo-500' : message.isError ? 'bg-red-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'
                    }`}>
                      {message.role === 'user' ? <User className="text-white" size={20} /> : <Bot className="text-white" size={20} />}
                    </div>

                    <div className={`flex-1 max-w-[80%]`}>
                      <div className={`rounded-2xl p-4 ${
                        message.role === 'user' ? 'bg-indigo-500 text-white' : message.isError ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-white text-gray-800 shadow-md'
                      }`}>
                        {message.files && message.files.length > 0 && (
                          <div className="mb-2 space-y-1">
                            {message.files.map((file, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm opacity-90">
                                {file.type.startsWith('image/') ? <Image size={16} /> : <FileText size={16} />}
                                <span>{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="prose prose-sm max-w-none">
                          {formatChatMessage(message.content)}
                        </div>
                        
                        <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Bot className="text-white" size={20} />
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-md">
                      <Loader className="animate-spin text-purple-500" size={24} />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="bg-white p-4 border-t">
              {selectedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
                      {file.type.startsWith('image/') ? <Image size={16} className="text-purple-600" /> : <FileText size={16} className="text-purple-600" />}
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Pose ta question..."
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                  disabled={isChatLoading}
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-xl transition-all transform hover:scale-105 disabled:scale-100"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
        <MainNavigation />
      </div>
    );
  }

  // VUE ACCUEIL
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-3 rounded-xl">
                  <Brain className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Tuteur Intelligent</h1>
                  <p className="text-gray-600">Ton assistant pédagogique personnalisé</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-lg">
                  <Star className="text-orange-500" size={20} />
                  <span className="font-semibold text-orange-700">{studentProgress.streak} jours de suite!</span>
                </div>
                <button
                  onClick={logout}
                  title="Se déconnecter"
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span className="font-semibold text-sm hidden md:inline">Déconnexion</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="text-yellow-500" size={24} />
                <span className="text-gray-600">Total Exercices</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">{studentProgress.totalExercises}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-blue-500" size={24} />
                <span className="text-gray-600">Maths</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">{studentProgress.mathsScore}%</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="text-green-500" size={24} />
                <span className="text-gray-600">Français</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{studentProgress.francaisScore}%</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="text-purple-500" size={24} />
                <span className="text-gray-600">Sciences</span>
              </div>
              <p className="text-3xl font-bold text-purple-600">{studentProgress.sciencesScore}%</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Choisis une matière</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {subjects.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => {
                    setSelectedSubject(subject.id);
                    setCurrentView('selectLevel');
                  }}
                  className={`${subject.color} hover:opacity-90 transition-all transform hover:scale-105 text-white rounded-2xl p-6 shadow-lg`}
                >
                  <div className="text-5xl mb-3">{subject.icon}</div>
                  <div className="font-bold text-lg">{subject.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <MainNavigation />
      </div>
    );
  }

  // VUE SÉLECTION NIVEAU
  if (currentView === 'selectLevel') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <button 
              onClick={() => setCurrentView('home')}
              className="mb-6 text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              ← Retour aux matières
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Choisis ton niveau</h2>
            
            <div className="space-y-3">
              {levels.map(level => (
                <button
                  key={level.id}
                  onClick={() => {
                    setSelectedLevel(level.id);
                    setCurrentView('lesson');
                  }}
                  className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl p-5 shadow-lg transition-all transform hover:scale-102 flex items-center justify-between"
                >
                  <div className="text-left">
                    <div className="font-bold text-xl">{level.name}</div>
                    <div className="text-indigo-100 text-sm">{level.grade}</div>
                  </div>
                  <div className="text-3xl">📖</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VUE LEÇON
  const lesson = lessons[selectedSubject]?.[selectedLevel];

  if (currentView === 'lesson' && !exerciseMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <button 
              onClick={() => setCurrentView('selectLevel')}
              className="mb-6 text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              ← Changer de niveau
            </button>

            {lesson ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="text-indigo-600" size={32} />
                  <h2 className="text-3xl font-bold text-gray-800">{lesson.title}</h2>
                </div>

                <div className="bg-indigo-50 rounded-xl p-6 mb-8">
                  <div className="prose prose-lg max-w-none">
                    {lesson.content.split('\n').map((line, i) => (
                      <p key={i} className="text-gray-700 mb-3 leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={startExercises}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Trophy size={24} />
                    Faire les exercices
                  </button>

                  <button
                    onClick={() => setCurrentView('chat')}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <MessageCircle size={24} />
                    Poser des questions
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Cette leçon sera bientôt disponible ! 📚</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // MODE EXERCICES
  if (exerciseMode && lesson) {
    const exercise = lesson.exercises[currentExercise];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Brain className="text-indigo-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-800">Exercice {currentExercise + 1}/{lesson.exercises.length}</h2>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <span className="font-bold text-green-700">Score: {score}/{lesson.exercises.length}</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <p className="text-xl text-gray-800 font-semibold mb-6">{exercise.question}</p>
              
              <div className="space-y-3">
                {exercise.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setUserAnswer(option)}
                    disabled={showFeedback}
                    className={`w-full p-4 rounded-lg text-left font-medium transition-all ${
                      userAnswer === option ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-indigo-100 border-2 border-gray-200'
                    } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {!showFeedback ? (
              <button
                onClick={handleAnswerSubmit}
                disabled={!userAnswer}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                Valider ma réponse
              </button>
            ) : (
              <div className={`rounded-xl p-6 mb-4 ${feedbackCorrect ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
                <div className="flex items-center gap-3 mb-3">
                  {feedbackCorrect ? (
                    <>
                      <CheckCircle className="text-green-600" size={32} />
                      <span className="text-2xl font-bold text-green-700">Bravo ! 🎉</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-600" size={32} />
                      <span className="text-2xl font-bold text-red-700">Pas tout à fait...</span>
                    </>
                  )}
                </div>
                <p className="text-gray-700 text-lg mb-4">{exercise.explanation}</p>
                <button
                  onClick={nextExercise}
                  className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  {currentExercise < lesson.exercises.length - 1 ? 'Exercice suivant →' : 'Terminer 🏆'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TuteurIntelligent;