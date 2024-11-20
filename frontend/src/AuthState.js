import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient' // Ensure you have your Supabase client initialized

const AuthState = () => {
  const [user, setUser] = useState(null) // State to track the current user

  // useEffect to track auth state changes
  useEffect(() => {
    // Fetch the current session when the component mounts
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
      } else {
        setUser(data?.session?.user ?? null) // Set the user if a session exists
      }
    }

    getSession()

    // Listen for auth state changes (login, logout)
    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null) // Update the user state when auth state changes
      }
    )

    // Clean up the listener when the component unmounts
    return () => {
      subscription?.unsubscribe() // Correctly clean up the subscription
    }
  }, [])

  // Function to log out the user
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null) // Clear the user after logging out
  }

  return (
    <div>
      {user ? (
        <div>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>{' '}
          {/* Button to log out */}
        </div>
      ) : (
        <p>No user logged in.</p> // Message when no user is logged in
      )}
    </div>
  )
}

export default AuthState
