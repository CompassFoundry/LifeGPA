import React, { createContext, useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null) // State to track the current user
  const [loading, setLoading] = useState(true) // State to track loading status

  const fetchUser = async () => {
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession()
      if (sessionError) throw sessionError

      const sessionUser = sessionData?.session?.user

      if (sessionUser) {
        // Fetch the user's role and details from the database
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('user_id, email, role')
          .eq('user_id', sessionUser.id)
          .single()

        if (userError) throw userError

        setUser(userData) // Set user data
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUser(null) // Clear user if error occurs
    } finally {
      setLoading(false) // Stop loading once complete
    }
  }

  useEffect(() => {
    fetchUser() // Fetch user data when the component mounts

    // Listen for auth state changes (login, logout)
    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user) // Optimistically set user for fast state updates
          fetchUser() // Fetch full user details
        } else {
          setUser(null)
          setLoading(false) // Ensure loading is cleared
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
