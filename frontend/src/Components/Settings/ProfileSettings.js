import React from 'react'

const ProfileSettings = ({ user }) => {
  return (
    <div>
      <h1>Profile Settings</h1>
      <p>Welcome, {user?.email}</p>
    </div>
  )
}

export default ProfileSettings
