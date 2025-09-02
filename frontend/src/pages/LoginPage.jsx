import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { login, isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from)
    }
  }, [isAuthenticated, navigate, from])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        navigate(from)
      }
    } catch (error) {
      // Error is handled in the login function
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-beige via-white to-light-blue flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to home button */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.backToHome', 'Retour à l\'accueil')}
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
            {t('auth.welcomeBack', 'Bon retour !')}
          </h2>
          <p className="text-gray-600">
            {t('auth.signInToAccount', 'Connectez-vous à votre compte Ecoloop')}
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
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder={t('auth.emailPlaceholder', 'votre@email.com')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder={t('auth.passwordPlaceholder', 'Votre mot de passe')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  {t('auth.rememberMe', 'Se souvenir de moi')}
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {t('auth.forgotPassword')}
              </Link>
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
                t('auth.signIn')
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('auth.noAccount')}{' '}
              <Link
                to="/signup"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {t('auth.createAccount')}
              </Link>
            </p>
          </div>

          {/* Demo accounts */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">
              {t('auth.demoAccounts', 'Comptes de démonstration')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    email: 'user@demo.com',
                    password: 'demo123'
                  })
                }}
                className="text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Utilisateur
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    email: 'admin@demo.com',
                    password: 'admin123'
                  })
                }}
                className="text-xs px-3 py-2 bg-orange-web/10 text-orange-web rounded-lg hover:bg-orange-web/20 transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
