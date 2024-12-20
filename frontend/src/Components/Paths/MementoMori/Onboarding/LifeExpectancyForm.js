import React, { useState, useEffect } from 'react'
import { supabase } from '../../../../supabaseClient'
import styles from './Onboarding.module.css'
import { useNavigate } from 'react-router-dom'

const LifeExpectancyForm = () => {
  const [age, setAge] = useState('')
  const [lifeExpectancy, setLifeExpectancy] = useState('80') // Default to 80 years
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const validateSession = async () => {
      const { data: session, error } = await supabase.auth.getSession()

      if (error || !session?.session) {
        console.error('No active session:', error || 'Session is null')
        setError('User is not authenticated. Redirecting to login...')
        navigate('/login')
        return
      }

      const user = session.session.user

      // Ensure the user exists in the database
      const { error: upsertError } = await supabase.from('users').upsert(
        {
          user_id: user.id,
          email: user.email,
        },
        { onConflict: 'user_id' } // Avoid duplicate entries
      )

      if (upsertError) {
        console.error('Error upserting user:', upsertError)
      }

      // Fetch user data
      const { data: userData } = await supabase
        .from('users')
        .select('age')
        .eq('user_id', user.id)
        .single()

      if (userData?.age) {
        navigate('/memento-mori/home') // If user has age, redirect to home
      }
    }

    validateSession()
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!age || age < 0 || age > 120) {
      setError('Please enter a valid age between 0 and 120.')
      return
    }

    if (!lifeExpectancy || lifeExpectancy < age || lifeExpectancy > 120) {
      setError(
        'Please enter a realistic life expectancy greater than your age.'
      )
      return
    }

    setError('')

    // Save user data to the database
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      setError('Unable to retrieve user ID. Please log in again.')
      return
    }

    const { error } = await supabase
      .from('users')
      .update({
        age: Number(age),
        life_expectancy: Number(lifeExpectancy),
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Failed to update database:', error)
      setError('Failed to save your data. Please try again.')
      return
    }

    // Redirect to /memento-mori/home after saving
    navigate('/memento-mori/home')
  }

  return (
    <form className={styles['life-expectancy-form']} onSubmit={handleSubmit}>
      <h2>Set Your Age and Life Expectancy</h2>
      {error && <p className={styles['error-message']}>{error}</p>}
      <div className={styles['form-group']}>
        <label htmlFor='age'>Your Age:</label>
        <input
          type='number'
          id='age'
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder='Enter your age'
        />
      </div>
      <div className={styles['form-group']}>
        <label htmlFor='life-expectancy'>Life Expectancy:</label>
        <input
          type='number'
          id='life-expectancy'
          value={lifeExpectancy}
          onChange={(e) => setLifeExpectancy(e.target.value)}
          placeholder='Enter your expected lifespan'
        />
      </div>
      <button type='submit' className={styles['calculate-button']}>
        Submit
      </button>
    </form>
  )
}

export default LifeExpectancyForm
