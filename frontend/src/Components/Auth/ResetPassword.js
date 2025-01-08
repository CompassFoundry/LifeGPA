import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import styles from './Auth.module.css'

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isPasswordReset, setIsPasswordReset] = useState(false) // Track password reset success
  const navigate = useNavigate()

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        setMessage('Failed to reset password. Please try again.')
        console.error('Error resetting password:', error)
      } else {
        setMessage('Password reset successfully!')
        setIsPasswordReset(true) // Trigger navigation when password is reset
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      setMessage('An unexpected error occurred.')
    }
  }

  // Handle navigation when the password reset is successful
  useEffect(() => {
    if (isPasswordReset) {
      const timeout = setTimeout(() => {
        navigate('/login') // Navigate to login page
      }, 2000)

      // Clean up timeout
      return () => clearTimeout(timeout)
    }
  }, [isPasswordReset, navigate])

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleResetPassword}>
        <h2 className={styles.heading}>Reset Password</h2>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor='newPassword'>
            New Password:
          </label>
          <input
            className={styles.input}
            id='newPassword'
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor='confirmPassword'>
            Confirm Password:
          </label>
          <input
            className={styles.input}
            id='confirmPassword'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' className={styles.button}>
          Reset Password
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  )
}

export default ResetPassword
