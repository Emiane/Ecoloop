import React, { useState } from 'react'
import Layout from '../components/LayoutSimple'
import { MessageSquare, Users, Search, Plus, ThumbsUp, MessageCircle, Share } from 'lucide-react'

const ForumHome = () => {
  const [activeTab, setActiveTab] = useState('discussions')

  const categories = [
    { name: "Questions générales", count: 156, icon: MessageSquare },
    { name: "Maladies & Santé", count: 89, icon: Users },
    { name: "Alimentation", count: 134, icon: MessageSquare },
    { name: "Équipements", count: 67, icon: Users },
    { name: "Expériences & Conseils", count: 203, icon: MessageSquare }
  ]

  const discussions = [
    {
      id: 1,
      title: "Problème de ponte chez mes poules pondeuses",
      author: "Marie K.",
      category: "Maladies & Santé",
      replies: 12,
      likes: 8,
      time: "Il y a 2 heures",
      excerpt: "Mes poules de 8 mois ont arrêté de pondre depuis une semaine. Que faire ?",
      isHot: true
    },
    {
      id: 2,
      title: "Quel aliment pour optimiser la croissance ?",
      author: "Jean-Paul M.",
      category: "Alimentation",
      replies: 25,
      likes: 15,
      time: "Il y a 5 heures",
      excerpt: "Je cherche des conseils sur l'alimentation pour mes poulets de chair de 4 semaines...",
      isHot: false
    },
    {
      id: 3,
      title: "Construction d'un poulailler au Cameroun",
      author: "Amadou B.",
      category: "Équipements",
      replies: 18,
      likes: 22,
      time: "Il y a 1 jour",
      excerpt: "Partage de mon expérience de construction avec des matériaux locaux...",
      isHot: true
    },
    {
      id: 4,
      title: "Vaccination: calendrier recommandé",
      author: "Dr. Fatima L.",
      category: "Maladies & Santé",
      replies: 8,
      likes: 35,
      time: "Il y a 2 jours",
      excerpt: "Voici le calendrier de vaccination que je recommande pour les conditions locales...",
      isHot: false
    }
  ]

  const experts = [
    { name: "Dr. Fatima L.", specialty: "Vétérinaire", posts: 156, rating: 4.9 },
    { name: "Jean-Paul M.", specialty: "Éleveur expérimenté", posts: 89, rating: 4.7 },
    { name: "Marie K.", specialty: "Formation agricole", posts: 67, rating: 4.8 }
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forum Communautaire</h1>
            <p className="text-gray-600">Échangez avec la communauté d'éleveurs</p>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle discussion
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans le forum..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Discussions</p>
                <p className="text-2xl font-bold text-gray-900">649</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Membres actifs</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Réponses</p>
                <p className="text-2xl font-bold text-gray-900">3,567</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ThumbsUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Solutions utiles</p>
                <p className="text-2xl font-bold text-gray-900">456</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('discussions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'discussions'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Discussions récentes
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Catégories
            </button>
            <button
              onClick={() => setActiveTab('experts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'experts'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Experts
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'discussions' && (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div key={discussion.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {discussion.isHot && (
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                          🔥 Populaire
                        </span>
                      )}
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        {discussion.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-green-600 cursor-pointer">
                      {discussion.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{discussion.excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Par {discussion.author}</span>
                      <span>•</span>
                      <span>{discussion.time}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{discussion.replies} réponses</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{discussion.likes}</span>
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 p-2 text-gray-400 hover:text-gray-600">
                    <Share className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <category.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} discussions</p>
                  </div>
                </div>
                <button className="w-full bg-gray-50 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                  Voir les discussions
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'experts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{expert.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{expert.specialty}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Contributions:</span>
                      <span className="font-medium">{expert.posts}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Note:</span>
                      <div className="flex items-center">
                        <span className="font-medium mr-1">{expert.rating}</span>
                        <div className="flex text-yellow-400">
                          {'★'.repeat(Math.floor(expert.rating))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Voir le profil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ForumHome
