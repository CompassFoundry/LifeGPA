import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import RegisterUser from './Components/Auth/RegisterUser'
import LoginUser from './Components/Auth/LoginUser'
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
        <header className='header'>
          <h1>Life GPA</h1>
        </header>
        <main className='content'>
          {user ? (
            <div>
              <p>Logged in as: {user.email}</p>
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  setUser(null)
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Routes>
              <Route path='/' element={<RegisterUser />} />
              <Route path='/login' element={<LoginUser />} />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  )
}

export default App
