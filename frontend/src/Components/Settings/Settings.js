import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import styles from './Settings.module.css'

const Settings = ({ user }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [accountMessage, setAccountMessage] = useState('')

  // Fetch the user profile from the user_profiles table
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error.message)
      } else {
        setFirstName(data.first_name || '')
        setLastName(data.last_name || '')
      }
    }

    if (user) fetchProfile()
  }, [user])

  // Save profile updates to the user_profiles table
  const handleSaveProfile = async (e) => {
    e.preventDefault()

    const { error } = await supabase.from('user_profiles').upsert(
      {
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
      },
      { onConflict: 'user_id' } // Ensures upsert works without duplication
    )

    if (error) {
      console.error('Error saving profile:', error.message)
      setProfileMessage('Failed to save profile.')
    } else {
      setProfileMessage('Profile updated successfully!')
    }
  }

  // Update the user's password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setAccountMessage('New passwords do not match.')
      return
    }

    try {
      // Authenticate the user with the current password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })

      if (authError) {
        setAccountMessage('Current password is incorrect.')
        return
      }

      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setAccountMessage('Failed to update password. Please try again.')
      } else {
        setAccountMessage('Password updated successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setAccountMessage('An unexpected error occurred.')
    }
  }

  return (
    <div>
      {/* Profile Settings Container */}
      <div className={styles.container}>
        <h1 className={styles.heading}>Profile Settings</h1>
        <form onSubmit={handleSaveProfile} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor='firstName'>
              First Name:
            </label>
            <input
              id='firstName'
              className={styles.input}
              type='text'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder='Enter your first name'
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor='lastName'>
              Last Name:
            </label>
            <input
              id='lastName'
              className={styles.input}
              type='text'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder='Enter your last name'
              required
            />
          </div>
          <button type='submit' className={styles.button}>
            Save
          </button>
          {profileMessage && <p className={styles.message}>{profileMessage}</p>}
        </form>
      </div>

      {/* Account Settings Container */}

      <div className={styles.container}>
        <div>
          <p>
            <strong>Confirm Email Address</strong>
          </p>
        </div>
        <h1 className={styles.heading}>Account Settings</h1>
        <form onSubmit={handlePasswordUpdate} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor='currentPassword'>
              Current Password:
            </label>
            <input
              id='currentPassword'
              className={styles.input}
              type='password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder='Enter your current password'
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor='newPassword'>
              New Password:
            </label>
            <input
              id='newPassword'
              className={styles.input}
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='Enter your new password'
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor='confirmPassword'>
              Confirm New Password:
            </label>
            <input
              id='confirmPassword'
              className={styles.input}
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm your new password'
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor='email'>
              Email:
            </label>
            <input
              id='email'
              className={styles['input-readonly']}
              type='email'
              value={user.email}
              readOnly
            />
          </div>
          <button type='submit' className={styles.button}>
            Save
          </button>
          {accountMessage && <p className={styles.message}>{accountMessage}</p>}
        </form>
      </div>
    </div>
  )
}

export default Settings
