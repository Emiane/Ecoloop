import React, { useState } from 'react'
import Layout from '../components/LayoutSimple'
import { Play, Clock, CheckCircle, Star, Users } from 'lucide-react'

const TrainingHome = () => {
  const [activeTab, setActiveTab] = useState('courses')

  const courses = [
    {
      id: 1,
      title: "Bases de l'élevage de volailles",
      description: "Apprenez les fondamentaux de l'élevage avicole au Cameroun",
      duration: "2h 30min",
      lessons: 8,
      progress: 0,
      level: "Débutant",
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Alimentation et nutrition",
      description: "Maîtrisez l'alimentation optimale de vos volailles",
      duration: "3h 15min",
      lessons: 12,
      progress: 25,
      level: "Intermédiaire",
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Prévention des maladies",
      description: "Identifiez et prévenez les maladies courantes",
      duration: "2h 45min",
      lessons: 10,
      progress: 100,
      level: "Avancé",
      image: "/api/placeholder/300/200"
    }
  ]

  const quizzes = [
    {
      id: 1,
      title: "Quiz - Bases de l'élevage",
      questions: 15,
      duration: "20 min",
      score: null,
      difficulty: "Facile"
    },
    {
      id: 2,
      title: "Évaluation - Nutrition",
      questions: 25,
      duration: "35 min",
      score: 85,
      difficulty: "Moyen"
    }
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Formation</h1>
          <p className="text-gray-600">Développez vos compétences en élevage avicole</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Play className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Cours suivis</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Cours terminés</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Temps d'étude</p>
                <p className="text-2xl font-bold text-gray-900">8h</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Score moyen</p>
                <p className="text-2xl font-bold text-gray-900">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cours disponibles
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'progress'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mon progression
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'quizzes'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Quiz & Évaluations
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Play className="h-12 w-12 text-gray-400" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.level === 'Débutant' ? 'bg-green-100 text-green-600' :
                      course.level === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {course.level}
                    </span>
                    <span className="text-sm text-gray-500">{course.duration}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">{course.lessons} leçons</span>
                    <span className="text-sm text-gray-500">{course.progress}% terminé</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    {course.progress === 0 ? 'Commencer' : course.progress === 100 ? 'Revoir' : 'Continuer'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    quiz.difficulty === 'Facile' ? 'bg-green-100 text-green-600' :
                    quiz.difficulty === 'Moyen' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{quiz.questions} questions</span>
                    <span>{quiz.duration}</span>
                  </div>
                  {quiz.score && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Dernier score:</span>
                      <span className="font-semibold text-green-600">{quiz.score}%</span>
                    </div>
                  )}
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  {quiz.score ? 'Refaire le quiz' : 'Commencer le quiz'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default TrainingHome
