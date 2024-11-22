import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import styles from './ProfileSettings.module.css'

const ProfileSettings = ({ user }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [message, setMessage] = useState('')

  // Fetch the user profile from the database
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('user_id', user.id)
        .single() // Ensure you only get one row

      if (error) {
        console.error('Error fetching profile:', error.message)
      } else {
        setFirstName(data.first_name || '')
        setLastName(data.last_name || '')
      }
    }

    if (user) fetchProfile()
  }, [user])

  // Save profile updates to the database
  const handleSave = async (e) => {
    e.preventDefault()

    const { error } = await supabase.from('users').upsert(
      {
        user_id: user.id, // Ensure you target the correct user
        first_name: firstName,
        last_name: lastName,
      },
      { onConflict: 'user_id' } // Specify that the conflict should be resolved using 'user_id'
    )

    if (error) {
      console.error('Error saving profile:', error.message)
      setMessage('Failed to save profile.')
    } else {
      setMessage('Profile updated successfully!')
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Profile Settings</h1>
      <form onSubmit={handleSave} className={styles.form}>
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
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  )
}

export default ProfileSettings
