import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Contexts
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'

// Components
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import TrainingHome from './pages/TrainingHome'
import TrackingHome from './pages/TrackingHome'
import MonitoringDashboard from './pages/MonitoringDashboard'
import ForumHome from './pages/ForumHome'

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                
                {/* Protected routes with Layout */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Layout>
                      <ProfilePage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/training" element={
                  <ProtectedRoute>
                    <Layout>
                      <TrainingHome />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/tracking" element={
                  <ProtectedRoute>
                    <Layout>
                      <TrackingHome />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/monitoring" element={
                  <ProtectedRoute>
                    <Layout>
                      <MonitoringDashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/forum" element={
                  <ProtectedRoute>
                    <Layout>
                      <ForumHome />
                    </Layout>
                  </ProtectedRoute>
                } />
              </Routes>
              
              {/* Toast notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App

// Components
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Layout from './components/Layout'

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Layout>
                      <ProfilePage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Layout>
                      <SettingsPage />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Training Module - Free */}
                <Route path="/training" element={
                  <ProtectedRoute>
                    <Layout>
                      <TrainingHome />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/training/:category" element={
                  <ProtectedRoute>
                    <Layout>
                      <TrainingDetail />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/training/chatbot" element={
                  <ProtectedRoute>
                    <Layout>
                      <TrainingChatbot />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/training/vaccination" element={
                  <ProtectedRoute>
                    <Layout>
                      <VaccinationSchedule />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/training/equipment" element={
                  <ProtectedRoute>
                    <Layout>
                      <EquipmentGuide />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/training/diseases" element={
                  <ProtectedRoute>
                    <Layout>
                      <DiseaseGuide />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Tracking Module - Pro */}
                <Route path="/tracking" element={
                  <ProtectedRoute requiredSubscription="pro">
                    <Layout>
                      <TrackingHome />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/tracking/analysis" element={
                  <ProtectedRoute requiredSubscription="pro">
                    <Layout>
                      <ResourceAnalysis />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/tracking/plan/:planId?" element={
                  <ProtectedRoute requiredSubscription="pro">
                    <Layout>
                      <PlanSummary />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/tracking/daily/:lotId?" element={
                  <ProtectedRoute requiredSubscription="pro">
                    <Layout>
                      <DailyTracker />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/tracking/stats" element={
                  <ProtectedRoute requiredSubscription="pro">
                    <Layout>
                      <TrackingStats />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/tracking/lots" element={
                  <ProtectedRoute requiredSubscription="pro">
                    <Layout>
                      <LotManagement />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Monitoring Module - Premium */}
                <Route path="/monitoring" element={
                  <ProtectedRoute requiredSubscription="premium">
                    <Layout>
                      <MonitoringDashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/monitoring/settings" element={
                  <ProtectedRoute requiredSubscription="premium">
                    <Layout>
                      <MonitoringSettings />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/monitoring/camera" element={
                  <ProtectedRoute requiredSubscription="premium">
                    <Layout>
                      <CameraFeed />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Forum Module - Free */}
                <Route path="/forum" element={
                  <ProtectedRoute>
                    <Layout>
                      <ForumHome />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/forum/:category" element={
                  <ProtectedRoute>
                    <Layout>
                      <ForumCategory />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/forum/post/:postId" element={
                  <ProtectedRoute>
                    <Layout>
                      <ForumPost />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <Layout>
                      <AdminDashboard />
                    </Layout>
                  </AdminRoute>
                } />
                
                <Route path="/admin/users" element={
                  <AdminRoute>
                    <Layout>
                      <AdminUsers />
                    </Layout>
                  </AdminRoute>
                } />
                
                <Route path="/admin/content" element={
                  <AdminRoute>
                    <Layout>
                      <AdminContent />
                    </Layout>
                  </AdminRoute>
                } />
                
                <Route path="/admin/settings" element={
                  <AdminRoute>
                    <Layout>
                      <AdminSettings />
                    </Layout>
                  </AdminRoute>
                } />
              </Routes>
              
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    theme: {
                      primary: '#548C2F',
                      secondary: '#F2EFE5',
                    },
                  },
                  error: {
                    duration: 4000,
                    theme: {
                      primary: '#ef4444',
                      secondary: '#F2EFE5',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App
