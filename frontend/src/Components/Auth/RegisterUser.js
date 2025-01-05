import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Auth.module.css'
import { supabase } from '../../supabaseClient'
import { AuthContext } from './AuthState'

const RegisterUser = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState('')
  const navigate = useNavigate()
  const { fetchUser } = useContext(AuthContext) // Access global user state and fetchUser

  const handleRegister = async (e) => {
    e.preventDefault()

    // Validate password length
    if (password.length < 8) {
      setErrors('Password must be at least 8 characters long.')
      return
    }

    try {
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(
          'Unable to register. Please check your email or password and try again.'
        )
      } else {
        const { user } = data
        if (user) {
          // Call the backend to send the confirmation email
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/auth/send-confirmation-email`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user_id: user.id,
                email: user.email,
              }),
            }
          )

          if (!response.ok) {
            const errorData = await response.json()
            console.error('Error sending confirmation email:', errorData.error)
            setMessage(
              'Registration successful, but we were unable to send a confirmation email.'
            )
          } else {
            setMessage(
              'Registration successful! Please check your email to confirm your account.'
            )
          }

          // Update global user state and navigate to home page
          await fetchUser()
          navigate('/home') // Redirect to home page
        }
      }
    } catch (err) {
      console.error('Unexpected error during registration:', err)
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
          {errors && <p className={styles.error}>{errors}</p>}
        </div>
        <button type='submit' className={styles.button}>
          Sign Up
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
      <p className={styles.agreementText}>
        By clicking <strong>Sign Up</strong>, you agree to our{' '}
        <Link to='/terms-of-service' className={styles.toggleLink}>
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to='/privacy-policy' className={styles.toggleLink}>
          Privacy Policy
        </Link>
        .
      </p>
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
