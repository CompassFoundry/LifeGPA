import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom' // If using react-router
import axios from 'axios' // Or use fetch

const ConfirmEmail = () => {
  const [message, setMessage] = useState('')
  const location = useLocation()
  const token = new URLSearchParams(location.search).get('token') // Extract token from URL

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await axios.get(
          `https://your-backend-domain.com/auth/confirm-email?token=${token}`
        )
        setMessage(response.data.message) // Success message
      } catch (error) {
        setMessage(error.response?.data?.error || 'Failed to confirm email.')
      }
    }

    if (token) {
      confirmEmail()
    } else {
      setMessage('Invalid or missing token.')
    }
  }, [token])

  return (
    <div>
      <h1>Email Confirmation</h1>
      <p>{message}</p>
    </div>
  )
}

export default ConfirmEmail
