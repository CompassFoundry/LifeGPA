import React, { useState } from 'react'
import { Link } from 'react-router-dom' // Use Link for navigation
import styles from './Auth.module.css'
import { supabase } from '../../supabaseClient'

const LoginUser = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault() // Prevent default form submission behavior

    try {
      // Call Supabase's auth.signInWithPassword() method
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMessage(error.message) // Display error message
        console.error('Supabase login error:', error) // Log for debugging
      } else {
        setErrorMessage('') // Clear any previous error message
        console.log('User successfully logged in:', data) // Log for debugging
      }
    } catch (err) {
      console.error('Unexpected error:', err) // Catch unexpected errors
      setErrorMessage('An unexpected error occurred. Please try again.')
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' className={styles.button}>
          Login
        </button>
        {errorMessage && <p className={styles.message}>{errorMessage}</p>}
      </form>
      <p className={styles.toggleText}>
        Don't have an account?{' '}
        <Link to='/' className={styles.toggleLink}>
          Register
        </Link>
      </p>
    </div>
  )
}

export default LoginUser
