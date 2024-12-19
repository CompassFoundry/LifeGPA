import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import RegisterUser from '@components/Auth/RegisterUser'
import LoginUser from '@components/Auth/LoginUser'
import LoadingSpinner from '@components/Global/LoadingSpinner'
import LandingPage from '@components/Landing/LandingPage'
import Home from '@components/Home/Home'
import Header from '@components/Header/Header'
import Settings from '@components/Settings/Settings'
import LifeGPA from '@paths/LifeGPA/Onboarding/Landing'
import LifeGPAHome from '@paths/LifeGPA/Main/Home'
import LifeGPAOverview from '@paths/LifeGPA/Onboarding/Overview'
import LogReport from '@paths/LifeGPA/Main/LogReport'
import ViewReports from '@paths/LifeGPA/Main/ViewReports'
import Identity from '@paths/Identity/IdentityLanding'
import MementoMori from '@components/Paths/MementoMori/Onboarding/Landing'
import MementoMoriOverview from '@components/Paths/MementoMori/Onboarding/Overview'
import WageWatch from '@components/Paths/WageWatch/Overview'
import AdminDashboard from '@components/Admin/AdminDashboard'
import { supabase } from './supabaseClient'
import './styles/global.css'

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasReportCard, setHasReportCard] = useState(false)
  const [loadingReportCard, setLoadingReportCard] = useState(true)

  // Track auth state changes and re-fetch session on load
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

    // Track session changes
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

  // Fetch report card data to check if a report card exists for the user
  useEffect(() => {
    const checkReportCard = async () => {
      if (user) {
        setLoadingReportCard(true) // Set loading while fetching data
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
          setLoadingReportCard(false) // Loading ends after data is fetched
        }
      } else {
        setLoadingReportCard(false) // If user is not logged in, we're not fetching anything
      }
    }

    if (user) {
      checkReportCard()
    } else {
      setLoadingReportCard(false) // If no user, don't load report cards
    }
  }, [user])

  // Display a loading spinner while fetching user session or report card data
  if (loading || loadingReportCard) {
    return <LoadingSpinner /> // Show the loading spinner component
  }

  return (
    <Router>
      <div className='app'>
        <Header user={user} setUser={setUser} />
        <main className='content'>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/register' element={<RegisterUser />} />
            <Route path='/login' element={<LoginUser />} />
            <Route path='/settings' element={<Settings user={user} />} />
            <Route
              path='/home'
              element={<Home user={user} setUser={setUser} />}
            />
            <Route
              path='/life-gpa'
              element={
                hasReportCard ? (
                  <Navigate to='/life-gpa/home' replace />
                ) : (
                  <LifeGPA user={user} />
                )
              }
            />
            <Route
              path='/life-gpa/onboarding'
              element={
                hasReportCard ? (
                  <Navigate to='/life-gpa/home' replace />
                ) : (
                  <LifeGPAOverview
                    user={user}
                    setHasReportCard={setHasReportCard}
                  />
                )
              }
            />
            <Route
              path='/life-gpa/home'
              element={
                !hasReportCard ? (
                  <Navigate to='/life-gpa/onboarding' replace />
                ) : (
                  <LifeGPAHome user={user} />
                )
              }
            />
            <Route
              path='/life-gpa/log-report'
              element={
                <LogReport user={user} setHasReportCard={setHasReportCard} />
              }
            />
            <Route path='/identity' element={<Identity user={user} />} />
            <Route
              path='/life-gpa/view-reports'
              element={
                <ViewReports user={user} setHasReportCard={setHasReportCard} />
              }
            />
            <Route
              path='/memento-mori/'
              element={<MementoMori user={user} />}
            />
            <Route
              path='memento-mori/onboarding/'
              element={<MementoMoriOverview user={user} />}
            />
            <Route path='wage-watch/' element={<WageWatch user={user} />} />
            <Route path='/admin' element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
