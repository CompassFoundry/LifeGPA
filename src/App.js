import React, { useState, useEffect } from 'react'
import RegisterUser from './RegisterUser'
import LoginUser from './LoginUser'
import { supabase } from './supabaseClient'

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
    <div className='App'>
      <h1>Supabase Authentication</h1>
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
        <div>
          <RegisterUser />{' '}
          {/* Show registration form only if no user is logged in */}
          <LoginUser /> {/* Show login form only if no user is logged in */}
        </div>
      )}
    </div>
  )
}

export default App
