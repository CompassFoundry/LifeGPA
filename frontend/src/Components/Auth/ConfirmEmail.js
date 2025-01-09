import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import styles from './Auth.module.css'

const ConfirmEmail = () => {
  const [message, setMessage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const location = useLocation()
  const token = new URLSearchParams(location.search).get('token')

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await axios.get(
          `https://life-gpa.onrender.com/auth/confirm-email?token=${token}`
        )
        setMessage(response.data.message || 'Email confirmed successfully!')
      } catch (error) {
        console.error('Error confirming email:', error.response?.data || error)
        setMessage(error.response?.data?.error || 'Failed to confirm email.')
      } finally {
        setShowModal(true)
      }
    }

    if (token) {
      confirmEmail()
    } else {
      setMessage('Invalid or missing token.')
      setShowModal(true)
    }
  }, [token])

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <>
      {showModal && (
        <div className='modalOverlay'>
          <div className='modal'>
            <h2 className='modalHeading'>Email Confirmation</h2>
            <p className='modalMessage'>{message}</p>
            <button className={styles.button} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ConfirmEmail
