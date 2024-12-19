import React, { createContext, useState, useEffect } from 'react'
import { supabase } from './supabaseClient' // Ensure Supabase client is initialized

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null) // State to track the current user
  const [loading, setLoading] = useState(true) // State to track loading status

  useEffect(() => {
    // Fetch the current session and user data when the component mounts
    const fetchUser = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession()
        if (sessionError) throw sessionError

        const sessionUser = sessionData?.session?.user

        if (sessionUser) {
          // Fetch the user's role from the database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('user_id, email, role')
            .eq('user_id', sessionUser.id)
            .single()

          if (userError) throw userError

          setUser(userData) // Set user data with role
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false) // Set loading to false
      }
    }

    fetchUser()

    // Listen for auth state changes (login, logout)
    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          fetchUser() // Refetch user data on state change
        } else {
          setUser(null) // Clear user data on logout
        }
      }
    )

    // Clean up the listener when the component unmounts
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Function to log out the user
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null) // Clear the user after logging out
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
