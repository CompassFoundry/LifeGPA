import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import RegisterUser from '@components/Auth/RegisterUser'
import LoginUser from '@components/Auth/LoginUser'
import TermsOfService from '@components/Auth/TermsOfService'
import PrivacyPolicy from '@components/Auth/PrivacyPolicy'
import ProtectedRoute from '@components/Auth/ProtectedRoute'
import LoadingSpinner from '@components/Global/LoadingSpinner'
import LandingPage from '@components/Landing/LandingPage'
import Home from '@components/Home/Home'
import Header from '@components/Header/Header'
import Settings from '@components/Settings/Settings'
import LifeGPA from '@components/LifeGPA/Onboarding/Landing'
import LifeGPAHome from '@components/LifeGPA/Main/Home'
import LifeGPASettings from '@components/LifeGPA/Main/Settings'
import LifeGPAOverview from '@components/LifeGPA/Onboarding/Overview'
import LogReport from '@components/LifeGPA/Main/LogReport'
import ViewReports from '@components/LifeGPA/Main/ViewReports'
import { supabase } from './supabaseClient'
import './styles/global.css'

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasReportCard, setHasReportCard] = useState(false)
  const [loadingReportCard, setLoadingReportCard] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error.message)
      }
      setUser(data?.session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const checkReportCard = async () => {
      if (user) {
        setLoadingReportCard(true)
        try {
          const { data, error } = await supabase
            .from('report_cards')
            .select('*')
            .eq('user_id', user.id)
            .limit(1)

          if (error) {
            console.error('Error fetching report cards:', error.message)
          } else {
            setHasReportCard(data.length > 0)
          }
        } catch (err) {
          console.error('Unexpected error:', err)
        } finally {
          setLoadingReportCard(false)
        }
      } else {
        setLoadingReportCard(false)
      }
    }

    if (user) {
      checkReportCard()
    } else {
      setLoadingReportCard(false)
    }
  }, [user])

  if (loading || loadingReportCard) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <div className='app'>
        <Header user={user} setUser={setUser} />
        <main className='content'>
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<LandingPage />} />
            <Route path='/register' element={<RegisterUser />} />
            <Route path='/login' element={<LoginUser />} />
            <Route path='/terms-of-service' element={<TermsOfService />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />

            {/* Protected Routes */}
            <Route
              path='/settings'
              element={
                <ProtectedRoute>
                  <Settings user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/home'
              element={
                <ProtectedRoute>
                  <Home user={user} setUser={setUser} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/life-gpa'
              element={
                <ProtectedRoute>
                  {hasReportCard ? (
                    <Navigate to='/life-gpa/home' replace />
                  ) : (
                    <LifeGPA user={user} />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path='/life-gpa/onboarding'
              element={
                <ProtectedRoute>
                  {hasReportCard ? (
                    <Navigate to='/life-gpa/home' replace />
                  ) : (
                    <LifeGPAOverview
                      user={user}
                      setHasReportCard={setHasReportCard}
                    />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path='/life-gpa/home'
              element={
                <ProtectedRoute>
                  {!hasReportCard ? (
                    <Navigate to='/life-gpa/onboarding' replace />
                  ) : (
                    <LifeGPAHome user={user} />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path='/life-gpa/log-report'
              element={
                <ProtectedRoute>
                  <LogReport user={user} setHasReportCard={setHasReportCard} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/life-gpa/view-reports'
              element={
                <ProtectedRoute>
                  <ViewReports
                    user={user}
                    setHasReportCard={setHasReportCard}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path='/life-gpa/settings'
              element={
                <ProtectedRoute>
                  {!hasReportCard ? (
                    <Navigate to='/life-gpa/onboarding' replace />
                  ) : (
                    <LifeGPASettings user={user} />
                  )}
                </ProtectedRoute>
              }
            />

            {/* Catch-all route for unmatched URLs */}
            <Route
              path='*'
              element={
                user ? (
                  <Navigate to='/home' replace />
                ) : (
                  <Navigate to='/login' replace />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
