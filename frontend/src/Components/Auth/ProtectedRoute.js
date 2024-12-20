import React from 'react'
import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '@components/Auth/AuthState'
import LoadingSpinner from '@components/Global/LoadingSpinner'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to='/login' /> // Redirect to login if no user is authenticated
  }

  return children // Render the protected content if authenticated
}

export default ProtectedRoute
