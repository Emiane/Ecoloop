import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Eye, EyeOff, Mail, Lock, User, MapPin, ArrowLeft } from 'lucide-react'

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const { signup, isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const cameroonCities = [
    { value: 'yaounde', label: t('cities.yaounde') },
    { value: 'douala', label: t('cities.douala') },
    { value: 'bamenda', label: t('cities.bamenda') },
    { value: 'garoua', label: t('cities.garoua') },
    { value: 'maroua', label: t('cities.maroua') },
    { value: 'bafoussam', label: t('cities.bafoussam') },
    { value: 'ngaoundere', label: t('cities.ngaoundere') },
    { value: 'bertoua', label: t('cities.bertoua') },
    { value: 'ebolowa', label: t('cities.ebolowa') },
    { value: 'kumba', label: t('cities.kumba') },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('auth.errors.firstNameRequired', 'Le prénom est requis')
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('auth.errors.lastNameRequired', 'Le nom est requis')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('auth.errors.emailRequired', 'L\'email est requis')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.errors.emailInvalid', 'Email invalide')
    }

    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired', 'Le mot de passe est requis')
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.errors.passwordTooShort', 'Le mot de passe doit contenir au moins 6 caractères')
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.confirmPasswordRequired', 'Confirmez votre mot de passe')
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.passwordsNotMatch', 'Les mots de passe ne correspondent pas')
    }

    if (!formData.city) {
      newErrors.city = t('auth.errors.cityRequired', 'La ville est requise')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const result = await signup(formData)
      if (result.success) {
        navigate('/dashboard')
      }
    } catch (error) {
      // Error is handled in the signup function
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
            {t('auth.createAccount')}
          </h2>
          <p className="text-gray-600">
            {t('auth.joinEcoloop', 'Rejoignez la communauté Ecoloop')}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.firstName')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder={t('auth.firstNamePlaceholder', 'Jean')}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.lastName')}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder={t('auth.lastNamePlaceholder', 'Dupont')}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

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
                  className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder={t('auth.emailPlaceholder', 'votre@email.com')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.city')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.city ? 'border-red-500' : ''}`}
                >
                  <option value="">{t('auth.selectCity', 'Sélectionnez votre ville')}</option>
                  {cameroonCities.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
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
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder={t('auth.passwordPlaceholder', 'Au moins 6 caractères')}
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder={t('auth.confirmPasswordPlaceholder', 'Confirmez votre mot de passe')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-600">
                  {t('auth.agreeToTerms', 'J\'accepte les')}{' '}
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    {t('auth.termsOfService', 'conditions d\'utilisation')}
                  </a>{' '}
                  {t('auth.and', 'et la')}{' '}
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    {t('auth.privacyPolicy', 'politique de confidentialité')}
                  </a>
                </label>
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
                t('auth.createAccount')
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('auth.hasAccount')}{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
