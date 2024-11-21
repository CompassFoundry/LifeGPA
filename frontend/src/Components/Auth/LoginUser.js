import React, { useState } from 'react'
import { supabase } from '../../supabaseClient' // Ensure you import your Supabase client
import styles from './Auth.module.css' // Import styles

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
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleLogin}>
        <h2 className={styles.heading}>Login</h2>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor='email'>
            Email:
          </label>
          <input
            className={styles.input}
            id='email'
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor='password'>
            Password:
          </label>
          <input
            className={styles.input}
            id='password'
            type='password'
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' className={styles.button}>
          Login
        </button>
      </form>
      {errorMessage && <p className={styles.message}>{errorMessage}</p>}
    </div>
  )
}

export default LoginUser
