import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, Trophy, TrendingUp, CheckCircle, XCircle, RefreshCw, User, BarChart3, Star } from 'lucide-react';

const TuteurIntelligent = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [exerciseMode, setExerciseMode] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
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

📊 Exemple : 3/4 signifie "3 parts sur 4 parts au total"

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
        title: 'La Multiplication - Tables et techniques',
        content: `La multiplication est une addition répétée qui permet de calculer plus rapidement.

🔹 Principe de base :
   • 4 × 3 signifie "4 groupes de 3" ou "3 + 3 + 3 + 3"
   • Le résultat s'appelle le produit

📊 Propriétés importantes :
   • Commutativité : 4 × 3 = 3 × 4
   • Multiplication par 1 : tout nombre × 1 = ce nombre
   • Multiplication par 0 : tout nombre × 0 = 0

💡 Technique de la table de 9 avec les doigts :
Pour 9 × 6, baisse le 6ème doigt. À gauche = dizaines (5), à droite = unités (4). Réponse : 54!`,
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
        content: `Pour former le pluriel des noms, on ajoute généralement un "s" à la fin.

🔹 Règle générale :
   • un chat → des chats
   • une table → des tables

📊 Cas particuliers :
   • Noms en -eau, -au, -eu → ajouter "x" : un bateau → des bateaux
   • Noms en -al → changent en "aux" : un cheval → des chevaux
   • Noms en -ou → généralement "s", sauf exceptions : un chou → des choux

💡 Les 7 noms en -ou qui prennent "x" : bijou, caillou, chou, genou, hibou, joujou, pou`,
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
        content: `L'eau sur Terre effectue un cycle permanent entre la terre, les océans et l'atmosphère.

🔹 Les étapes du cycle :
   1. Évaporation : l'eau des océans et rivières se transforme en vapeur
   2. Condensation : la vapeur se refroidit et forme des nuages
   3. Précipitation : l'eau retombe sous forme de pluie ou neige
   4. Ruissellement : l'eau retourne vers les rivières et océans

💧 Importance :
   • L'eau est recyclée naturellement
   • La quantité totale d'eau sur Terre reste constante
   • Ce cycle permet la vie sur notre planète`,
        exercises: [
          {
            question: "Comment s'appelle la transformation de l'eau liquide en vapeur ?",
            options: ["Condensation", "Évaporation", "Précipitation", "Ruissellement"],
            correct: "Évaporation",
            explanation: "L'évaporation est le passage de l'eau de l'état liquide à l'état gazeux (vapeur)."
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

  // Fonction IA pour adapter le contenu
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

  // Interface d'accueil
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
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
              <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-lg">
                <Star className="text-orange-500" size={20} />
                <span className="font-semibold text-orange-700">{studentProgress.streak} jours de suite!</span>
              </div>
            </div>
          </div>

          {/* Statistiques */}
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

          {/* Sélection de matière */}
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
      </div>
    );
  }

  // Sélection du niveau
  if (currentView === 'selectLevel') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
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

  // Vue de la leçon
  const lesson = lessons[selectedSubject]?.[selectedLevel];

  if (currentView === 'lesson' && !exerciseMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
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
                      <p key={i} className="text-gray-700 mb-3 leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                <button
                  onClick={startExercises}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Trophy size={24} />
                  Commencer les exercices
                </button>
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

  // Mode exercices
  if (exerciseMode && lesson) {
    const exercise = lesson.exercises[currentExercise];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
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
                      userAnswer === option
                        ? 'bg-indigo-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-indigo-100 border-2 border-gray-200'
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