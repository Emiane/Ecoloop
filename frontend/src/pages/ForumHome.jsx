import React, { useState, useEffect } from 'react'
import { 
  MessageSquare, Plus, Search, TrendingUp, Clock, 
  MessageCircle, ThumbsUp, ThumbsDown, Pin, Lock, 
  ChevronRight, Users, Eye
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

const ForumHome = () => {
  const { user } = useAuth()
  const { language } = useLanguage()
  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchPosts()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory, language])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/forum/categories?lang=${language}`)
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Erreur récupération catégories forum:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const url = selectedCategory 
        ? `/api/forum/posts?category_id=${selectedCategory}&lang=${language}`
        : `/api/forum/posts?lang=${language}`
      
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setPosts(data.data.posts)
      }
    } catch (error) {
      console.error('Erreur récupération posts forum:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (searchTerm.length < 3) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/forum/search?q=${encodeURIComponent(searchTerm)}&lang=${language}`)
      const data = await response.json()
      if (data.success) {
        setPosts(data.data.results)
      }
    } catch (error) {
      console.error('Erreur recherche forum:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      return language === 'fr' ? 'Hier' : 'Yesterday'
    } else if (diffDays < 7) {
      return language === 'fr' ? `Il y a ${diffDays} jours` : `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getPostIcon = (replyCount) => {
    if (replyCount > 20) return '🔥'
    if (replyCount > 10) return '💬'
    if (replyCount > 5) return '📝'
    return '💭'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                {language === 'fr' ? 'Forum Communauté' : 'Community Forum'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {language === 'fr' 
                  ? 'Échangez avec d\'autres éleveurs de volaille'
                  : 'Connect with other poultry farmers'
                }
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {language === 'fr' ? 'Nouveau Post' : 'New Post'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'fr' ? 'Rechercher' : 'Search'}
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={language === 'fr' ? 'Rechercher...' : 'Search...'}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleSearch}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'fr' ? 'Catégories' : 'Categories'}
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedCategory === null
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {language === 'fr' ? 'Toutes' : 'All'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {posts.length}
                    </span>
                  </div>
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{category.post_count}</div>
                        <div className="text-xs text-gray-500">
                          {language === 'fr' ? 'posts' : 'posts'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'fr' ? 'Statistiques' : 'Community Stats'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">1,234</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'fr' ? 'Membres' : 'Members'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">567</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'fr' ? 'Discussions' : 'Discussions'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">12.5K</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'fr' ? 'Vues totales' : 'Total views'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'fr' ? 'Aucune discussion trouvée' : 'No discussions found'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {language === 'fr' 
                    ? 'Soyez le premier à démarrer une discussion dans cette catégorie.'
                    : 'Be the first to start a discussion in this category.'
                  }
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  {language === 'fr' ? 'Créer une Discussion' : 'Create Discussion'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">
                          {getPostIcon(post.reply_count)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {post.is_pinned && (
                                <Pin className="w-4 h-4 text-green-600" />
                              )}
                              {post.is_locked && (
                                <Lock className="w-4 h-4 text-red-600" />
                              )}
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                                {post.title}
                              </h3>
                            </div>
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: post.category.color + '20',
                                color: post.category.color 
                              }}
                            >
                              {post.category.name}
                            </span>
                          </div>

                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                            {post.content}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{post.author.name}</span>
                                {post.author.role === 'admin' && (
                                  <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs">
                                    {language === 'fr' ? 'Admin' : 'Admin'}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatDate(post.created_at)}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="w-4 h-4" />
                                  <span>{post.reply_count}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>{post.upvotes}</span>
                                </div>
                                {post.downvotes > 0 && (
                                  <div className="flex items-center gap-1">
                                    <ThumbsDown className="w-4 h-4" />
                                    <span>{post.downvotes}</span>
                                  </div>
                                )}
                              </div>

                              <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                                {language === 'fr' ? 'Lire' : 'Read'}
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'fr' ? 'Créer une discussion' : 'Create discussion'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {language === 'fr' 
                ? 'Cette fonctionnalité sera bientôt disponible. Vous pourrez créer et participer aux discussions de la communauté.'
                : 'This feature will be available soon. You will be able to create and participate in community discussions.'
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {language === 'fr' ? 'Fermer' : 'Close'}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {language === 'fr' ? 'Compris' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ForumHome
