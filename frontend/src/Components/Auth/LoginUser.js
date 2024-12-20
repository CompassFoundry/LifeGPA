import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Auth.module.css'
import { supabase } from '../../supabaseClient'
import { useContext } from 'react'
import { AuthContext } from './AuthState' // Import the AuthContext

const LoginUser = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext) // Use AuthContext to update the global user state

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
        console.log('User successfully logged in') // Log for debugging

        // Ensure the user's email is in the `users` table
        const user = data.user
        if (user) {
          const { error: upsertError } = await supabase.from('users').upsert(
            {
              user_id: user.id, // Ensure the correct user ID
              email: user.email, // Add the email address
            },
            { onConflict: 'user_id' } // Avoid duplicates
          )

          if (upsertError) {
            console.error('Error upserting user email:', upsertError.message)
          } else {
            console.log('User email successfully upserted to the users table.')
          }
        }

        // Update global user state
        setUser(user)

        // Navigate to the /home page
        navigate('/home')
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
        <Link to='/register' className={styles.toggleLink}>
          Sign Up
        </Link>
      </p>
    </div>
  )
}

export default LoginUser
