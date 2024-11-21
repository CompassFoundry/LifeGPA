import React from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate
import { supabase } from '../../supabaseClient' // Import Supabase client

const Home = ({ user, setUser }) => {
  const navigate = useNavigate() // Initialize useNavigate

  const handleLogout = async () => {
    await supabase.auth.signOut() // Log the user out
    setUser(null) // Clear the user state
    navigate('/login') // Redirect to the login page
  }

  return (
    <div>
      <p>Logged in as: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home
