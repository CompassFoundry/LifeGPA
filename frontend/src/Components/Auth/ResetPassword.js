import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import styles from './Auth.module.css'

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [setIsPasswordReset] = useState(false) // Track password reset success
  const [showModal, setShowModal] = useState(false) // Track modal visibility
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
        setShowModal(true) // Show the confirmation modal
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      setMessage('An unexpected error occurred.')
    }
  }

  // Handle navigation when the modal is closed
  const handleCloseModal = () => {
    setShowModal(false)
    navigate('/home') // Navigate to home page
  }

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

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalHeading}>Password Reset</h2>
            <p className={styles.modalMessage}>
              Your password has been successfully reset.
            </p>
            <button className={styles.button} onClick={handleCloseModal}>
              Continue to Home
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResetPassword
