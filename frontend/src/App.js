import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RegisterUser from './Components/Auth/RegisterUser'
import LoginUser from './Components/Auth/LoginUser'
import LandingPage from './Components/Landing/LandingPage'
import Home from './Components/Home/Home'
import Header from './Components/Header/Header'
import Settings from './Components/Settings/Settings'
import LifeGPA from './Components/Paths/LifeGPA/Onboarding/Landing'
import Overview from './Components/Paths/LifeGPA/Onboarding/Overview'
import Identity from './Components/Paths/Identity/IdentityLanding'
import { supabase } from './supabaseClient'
import './styles/global.css'

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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

  // Display a loading spinner while fetching user session
  if (loading) {
    return <div>Loading...</div>
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
            <Route
              path='/settings'
              element={
                <>
                  <Settings user={user} />
                </>
              }
            />
            <Route
              path='/home'
              element={<Home user={user} setUser={setUser} />}
            />
            <Route
              path='/life-gpa'
              element={
                <>
                  <LifeGPA user={user} />
                </>
              }
            />
            <Route
              path='/life-gpa/onboarding'
              element={<Overview user={user} />}
            />
            <Route
              path='/identity'
              element={
                <>
                  <Identity user={user} />
                </>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
