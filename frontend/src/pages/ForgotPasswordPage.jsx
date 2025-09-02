import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  
  const { forgotPassword } = useAuth()
  const { t } = useLanguage()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await forgotPassword(email)
      if (result.success) {
        setSent(true)
      }
    } catch (error) {
      // Error is handled in the forgotPassword function
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-beige via-white to-light-blue flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('auth.emailSent', 'Email envoyé !')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('auth.emailSentDescription', 'Si un compte avec cet email existe, vous recevrez des instructions pour réinitialiser votre mot de passe.')}
            </p>
            <div className="space-y-3">
              <Link to="/login" className="btn-primary w-full">
                {t('auth.backToLogin', 'Retour à la connexion')}
              </Link>
              <button
                onClick={() => {
                  setSent(false)
                  setEmail('')
                }}
                className="btn-outline w-full"
              >
                {t('auth.tryAgain', 'Réessayer')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-beige via-white to-light-blue flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to login button */}
        <Link
          to="/login"
          className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('auth.backToLogin', 'Retour à la connexion')}
        </Link>

        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <img
              src="/images/logo.png"
              alt="Ecoloop"
              className="h-12 w-auto"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'block'
              }}
            />
            <div className="hidden h-12 w-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('auth.forgotPassword')}
          </h2>
          <p className="text-gray-600">
            {t('auth.forgotPasswordDescription', 'Entrez votre email pour recevoir des instructions de réinitialisation')}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder={t('auth.emailPlaceholder', 'votre@email.com')}
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                t('auth.sendResetInstructions', 'Envoyer les instructions')
              )}
            </button>
          </form>

          {/* Additional help */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.rememberPassword', 'Vous vous souvenez de votre mot de passe ?')}{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {t('auth.signIn')}
              </Link>
            </p>
          </div>

          {/* Contact support */}
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 mb-2">
              {t('auth.needHelp', 'Besoin d\'aide ?')}
            </p>
            <a
              href="mailto:support@ecoloop.com"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              {t('auth.contactSupport', 'Contactez le support')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
