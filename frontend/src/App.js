import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RegisterUser from './Components/Auth/RegisterUser'
import LoginUser from './Components/Auth/LoginUser'
import LandingPage from './Components/Landing/LandingPage'
import Home from './Components/Home/Home'
import Header from './Components/Header/Header'
import AccountSettings from './Components/Settings/AccountSettings'
import ProfileSettings from './Components/Settings/ProfileSettings'
import { supabase } from './supabaseClient'
import './styles/global.css'

const App = () => {
  const [user, setUser] = useState(null)

  // Track auth state changes
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data?.session?.user ?? null)
    }

    getSession()

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

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
              path='/account-settings'
              element={
                <>
                  <AccountSettings user={user} setUser={setUser} />
                </>
              }
            />
            <Route
              path='/profile-settings'
              element={
                <>
                  <ProfileSettings user={user} setUser={setUser} />
                </>
              }
            />
            <Route
              path='/home'
              element={<Home user={user} setUser={setUser} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
