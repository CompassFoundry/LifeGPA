import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Auth.module.css'
import { supabase } from '../../supabaseClient'

const RegisterUser = () => {
  const [email, setEmail] = useState('') // Email for auth and users table
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      // Step 1: Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email, // The email used for authentication
        password,
      })

      if (error) {
        // Handle errors during authentication
        setMessage(`Error: ${error.message}`)
      } else {
        // Step 2: Insert into `users` table if registration succeeds
        const { user } = data
        if (user) {
          const { error: dbError } = await supabase.from('users').insert({
            user_id: user.id, // The unique ID from Supabase Auth
            email: user.email, // Save the same email
          })

          if (dbError) {
            setMessage(`Error saving user data: ${dbError.message}`)
          } else {
            // Redirect to /home after successful registration
            setMessage('Registration successful! Redirecting...')
            navigate('/home')
          }
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err)
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
