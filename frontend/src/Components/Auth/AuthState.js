import React, { createContext, useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession()
      if (sessionError) throw sessionError

      const sessionUser = sessionData?.session?.user

      if (sessionUser) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('user_id, email, role')
          .eq('user_id', sessionUser.id)
          .single()

        if (userError) throw userError

        setUser(userData)
      } else {
        console.warn('No session user found')
        setUser(null)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()

    const { subscription } = supabase.auth.onAuthStateChange(() => {
      fetchUser() // Fetch user data fully on auth state changes
    })

    return () => subscription?.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, handleLogout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
