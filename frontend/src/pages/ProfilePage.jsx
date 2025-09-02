import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user, updateProfile } = useAuth()
  const { t } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    farm_name: user?.farm_name || '',
    farm_size: user?.farm_size || '',
    experience_years: user?.experience_years || ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      await updateProfile(formData)
      setIsEditing(false)
      toast.success('Profil mis à jour avec succès')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil')
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      farm_name: user?.farm_name || '',
      farm_size: user?.farm_size || '',
      experience_years: user?.experience_years || ''
    })
    setIsEditing(false)
  }

  const getSubscriptionColor = (subscription) => {
    switch (subscription) {
      case 'premium':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'pro':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        {/* Header */}
        <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.name || 'Utilisateur'}
                </h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSubscriptionColor(user?.subscription)}`}>
                    {t(user?.subscription || 'free')}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Membre depuis {new Date(user?.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Annuler</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Informations personnelles
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    Nom complet
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{user?.name || 'Non renseigné'}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{user?.email}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Phone className="w-4 h-4 mr-2" />
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{user?.phone || 'Non renseigné'}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    Localisation
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{user?.location || 'Non renseigné'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Informations sur l'exploitation */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Informations sur l'exploitation
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Nom de l'exploitation
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="farm_name"
                      value={formData.farm_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{user?.farm_name || 'Non renseigné'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Taille de l'exploitation (nombre de volailles)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="farm_size"
                      value={formData.farm_size}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{user?.farm_size || 'Non renseigné'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Années d'expérience
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{user?.experience_years || 'Non renseigné'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Abonnement
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Plan actuel: <span className={`px-2 py-1 rounded text-sm ${getSubscriptionColor(user?.subscription)}`}>
                      {t(user?.subscription || 'free')}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {user?.subscription === 'free' && 'Accès aux formations de base'}
                    {user?.subscription === 'pro' && 'Accès aux formations + suivi des performances'}
                    {user?.subscription === 'premium' && 'Accès complet + surveillance avancée'}
                  </p>
                </div>
                {user?.subscription !== 'premium' && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    {t('upgrade')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
