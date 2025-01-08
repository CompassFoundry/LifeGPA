import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Auth.module.css'
import { supabase } from '../../supabaseClient'
import { AuthContext } from './AuthState'

const LoginUser = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotMessage, setForgotMessage] = useState('')
  const { user, fetchUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMessage(error.message)
        console.error('Supabase login error:', error)
      } else {
        setErrorMessage('')
        console.log('User successfully logged in:', data.user)
        await fetchUser()
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setErrorMessage('An unexpected error occurred. Please try again.')
    }
  }

  const handleForgotPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setForgotMessage('Failed to send password reset email. Try again.')
        console.error('Error sending reset email:', error)
      } else {
        setForgotMessage(
          'If that email matches what we have on file, we will send you email with instructions for resetting your password.'
        )
      }
    } catch (error) {
      setForgotMessage('An unexpected error occurred. Try again.')
      console.error('Unexpected error:', error)
    }
  }

  useEffect(() => {
    if (user) {
      navigate('/home')
    }
  }, [user, navigate])

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
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor='password'>
              Password:
            </label>
            <span
              className={styles.forgotPassword}
              onClick={() => setShowForgotPasswordModal(true)}
            >
              Forgot your password?
            </span>
          </div>
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

      {showForgotPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalHeading}>Forgot Password</h3>
            <p className={styles.modalMessage}>
              Enter your email to receive a password reset link.
            </p>
            <input
              className={styles.input}
              type='email'
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder='Enter your email'
              required
            />
            <button
              className={styles.button}
              onClick={handleForgotPassword}
              style={{ marginTop: '20px' }}
            >
              Send Reset Link
            </button>
            {forgotMessage && <p className={styles.message}>{forgotMessage}</p>}
            <p
              className={styles.toggleLink}
              onClick={() => setShowForgotPasswordModal(false)}
            >
              Close
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginUser
