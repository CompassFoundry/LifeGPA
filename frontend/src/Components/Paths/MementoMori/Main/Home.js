import React, { useEffect, useState } from 'react'
import { supabase } from '../../../../supabaseClient'
import styles from './Main.module.css'
import LoadingSpinner from '@components/Global/LoadingSpinner'

const Home = () => {
  const [remainingTime, setRemainingTime] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true) // Initialize with true

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: session, error: sessionError } =
          await supabase.auth.getSession()

        if (sessionError || !session?.session) {
          console.error('Session error:', sessionError)
          setError('User is not authenticated. Please log in.')
          setLoading(false) // Stop loading
          return
        }

        const userId = session.session.user.id

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('age, life_expectancy')
          .eq('user_id', userId)
          .single()

        if (userError || !userData) {
          console.error('Error fetching user data:', userError)
          setError('Failed to retrieve user data.')
          setLoading(false) // Stop loading
          return
        }

        const { age, life_expectancy } = userData

        // Perform calculations
        const remainingYears = life_expectancy - age
        const remainingWeeks = remainingYears * 52
        const remainingDays = remainingYears * 365
        const remainingHours = remainingDays * 24

        setRemainingTime({
          remainingYears,
          remainingWeeks,
          remainingDays,
          remainingHours,
        })
        setLoading(false) // Stop loading once data is set
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('An unexpected error occurred.')
        setLoading(false) // Stop loading on error
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return <LoadingSpinner /> // Display loading spinner
  }

  if (error) {
    return <p className={styles['error-message']}>{error}</p>
  }

  return (
    <div className={styles['home-container']}>
      <h1 className={styles['heading']}>Your Remaining Time</h1>
      <div className={styles['time-container']}>
        <p>
          <strong>Years:</strong> {remainingTime.remainingYears}
        </p>
        <p>
          <strong>Weeks:</strong> {remainingTime.remainingWeeks}
        </p>
        <p>
          <strong>Days:</strong> {remainingTime.remainingDays}
        </p>
        <p>
          <strong>Hours:</strong> {remainingTime.remainingHours}
        </p>
      </div>
    </div>
  )
}

export default Home
