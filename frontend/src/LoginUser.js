import React, { useState } from 'react'
import { supabase } from './supabaseClient' // Ensure you import your Supabase client

const LoginUser = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    // Validate email and password before sending
    if (!email || !password) {
      setErrorMessage('Email and password are required.')
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        setErrorMessage(error.message)
        console.error('Supabase login error:', error)
      } else {
        console.log('Login successful:', data)
        // Handle successful login (e.g., redirect or set user state)
      }
    } catch (error) {
      console.error('Error:', error)
      setErrorMessage('An unexpected error occurred.')
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type='email'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Enter your password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type='submit'>Login</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  )
}

export default LoginUser
