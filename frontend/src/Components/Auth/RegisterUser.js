import React, { useState } from 'react'
import { Link } from 'react-router-dom' // Use Link for navigation
import styles from './Auth.module.css'
import { supabase } from '../../supabaseClient'

const RegisterUser = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault() // Prevent form default submission behavior

    try {
      // Call Supabase's auth.signUp() method
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('User already registered')) {
          setMessage(
            'This email is already registered. Try logging in instead.'
          )
        } else {
          setMessage(error.message) // Display the generic error
        }
      } else {
        setMessage('Check your email for confirmation link!') // Success message
        console.log('User successfully registered:', data) // Log for debugging
      }
    } catch (err) {
      console.error('Unexpected error:', err) // Catch unexpected errors
      setMessage('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleRegister}>
        <h2 className={styles.heading}>Create an Account</h2>
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
          Sign Up
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
      <p className={styles.toggleText}>
        Already signed up?{' '}
        <Link to='/login' className={styles.toggleLink}>
          Login
        </Link>
      </p>
    </div>
  )
}

export default RegisterUser
