import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'

const AccountSettings = ({ user }) => {
  const [firstName, setFirstName] = useState(null)
  const [isLoading, setIsLoading] = useState(true) // Add a loading state

  useEffect(() => {
    const fetchFirstName = async () => {
      if (user) {
        setIsLoading(true) // Start loading
        const { data, error } = await supabase
          .from('users')
          .select('first_name')
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error('Error fetching first name:', error.message)
          setFirstName(null) // Handle errors by setting null
        } else {
          setFirstName(data?.first_name || null) // Update first name
        }
        setIsLoading(false) // Stop loading
      }
    }

    fetchFirstName()
  }, [user])

  return (
    <div>
      <h1>Account Settings</h1>
      <p>Hey, {isLoading ? '' : firstName ? firstName : 'there'}!</p>
    </div>
  )
}

export default AccountSettings
