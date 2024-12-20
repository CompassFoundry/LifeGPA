import React, { createContext, useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null) // Track the current user
  const [loading, setLoading] = useState(true) // Track loading status

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
          .select('user_id, email, role') // Adjust field names as needed
          .eq('user_id', sessionUser.id) // Use user_id as the primary key
          .single()

        if (userError) throw userError

        setUser(userData) // Set user data
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUser(null) // Clear user on error
    } finally {
      setLoading(false) // Stop loading
    }
  }

  useEffect(() => {
    fetchUser() // Fetch user data on mount

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          fetchUser() // Fetch user data fully
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null) // Clear the user after logout
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
