import React from 'react'

const AccountSettings = ({ user }) => {
  return (
    <div>
      <h1>Account Settings</h1>
      <p>Welcome, {user?.email}</p>
    </div>
  )
}

export default AccountSettings
