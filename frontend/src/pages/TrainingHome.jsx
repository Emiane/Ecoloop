import React, { useState, useEffect } from 'react'
import { BookOpen, Clock, Star, Lock, User, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

const TrainingHome = () => {
  const { user } = useAuth()
  const { language, t } = useLanguage()
  const [categories, setCategories] = useState([])
  const [content, setContent] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  const categoryIcons = {
    breeding: '🐣',
    housing: '🏠',
    feeding: '🌾',
    health: '💊',
    business: '💰',
    equipment: '⚙️'
  }

  const categoryNames = {
    fr: {
      breeding: 'Élevage',
      housing: 'Logement',
      feeding: 'Alimentation',
      health: 'Santé',
      business: 'Business',
      equipment: 'Équipements'
    },
    en: {
      breeding: 'Breeding',
      housing: 'Housing',
      feeding: 'Feeding',
      health: 'Health',
      business: 'Business',
      equipment: 'Equipment'
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchContent()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/training/categories?lang=${language}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Erreur récupération catégories:', error)
    }
  }

  const fetchContent = async () => {
    try {
      setLoading(true)
      const url = selectedCategory === 'all' 
        ? `/api/training/content?lang=${language}`
        : `/api/training/content/${selectedCategory}?lang=${language}`
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      if (data.success) {
        setContent(data.data)
      }
    } catch (error) {
      console.error('Erreur récupération contenu:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [selectedCategory, language])

  const canAccessContent = (isPremium) => {
    if (!isPremium) return true
    return user?.subscription === 'premium'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                {language === 'fr' ? 'Formation' : 'Training'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {language === 'fr' 
                  ? 'Apprenez les meilleures pratiques d\'élevage de volaille'
                  : 'Learn the best practices in poultry farming'
                }
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{content.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'fr' ? 'Modules' : 'Modules'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{categories.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'fr' ? 'Catégories' : 'Categories'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Catégories */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'fr' ? 'Catégories' : 'Categories'}
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📚</span>
                    <div>
                      <div className="font-medium">
                        {language === 'fr' ? 'Toutes' : 'All'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {content.length} {language === 'fr' ? 'modules' : 'modules'}
                      </div>
                    </div>
                  </div>
                </button>

                {categories.map((category) => (
                  <button
                    key={category.category}
                    onClick={() => setSelectedCategory(category.category)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === category.category
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {categoryIcons[category.category] || '📄'}
                      </span>
                      <div>
                        <div className="font-medium">
                          {categoryNames[language]?.[category.category] || category.category}
                        </div>
                        <div className="text-sm text-gray-500">
                          {category.count} {language === 'fr' ? 'modules' : 'modules'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Upgrade prompt for free users */}
              {user?.subscription === 'free' && (
                <div className="mt-6 p-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5" />
                    <span className="font-semibold">Premium</span>
                  </div>
                  <p className="text-sm mb-3">
                    {language === 'fr' 
                      ? 'Accédez à tous les contenus de formation premium'
                      : 'Access all premium training content'
                    }
                  </p>
                  <button className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                    {language === 'fr' ? 'Passer au Premium' : 'Upgrade to Premium'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {categoryIcons[item.category] || '📄'}
                          </span>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {categoryNames[language]?.[item.category] || item.category}
                            </p>
                          </div>
                        </div>
                        {item.is_premium && (
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Lock className="w-4 h-4" />
                            <span className="text-xs font-medium">Premium</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                        {item.summary}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>5-10 min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{language === 'fr' ? 'Débutant' : 'Beginner'}</span>
                          </div>
                        </div>

                        <button
                          disabled={item.is_premium && !canAccessContent(item.is_premium)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            item.is_premium && !canAccessContent(item.is_premium)
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {item.is_premium && !canAccessContent(item.is_premium) ? (
                            <>
                              <Lock className="w-4 h-4" />
                              {language === 'fr' ? 'Premium' : 'Premium'}
                            </>
                          ) : (
                            <>
                              {language === 'fr' ? 'Lire' : 'Read'}
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && content.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'fr' ? 'Aucun contenu trouvé' : 'No content found'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'fr' 
                    ? 'Aucun module de formation disponible dans cette catégorie.'
                    : 'No training modules available in this category.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainingHome
