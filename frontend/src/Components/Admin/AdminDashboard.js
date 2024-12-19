import React, { useContext, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../AuthState'

const AdminDashboard = () => {
  const { user, loading } = useContext(AuthContext)

  useEffect(() => {
    console.log('User in AdminDashboard:', user) // Debug log
    console.log('Loading state in AdminDashboard:', loading) // Debug loading state
  }, [user, loading])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== 'super admin') {
    console.log('Redirecting from AdminDashboard') // Log the redirect
    return <Navigate to='/home' replace />
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.email}! You have admin access.</p>
    </div>
  )
}

export default AdminDashboard
