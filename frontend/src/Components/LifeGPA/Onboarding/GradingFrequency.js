// src/Components/Paths/LifeGPA/Onboarding/GradingFrequency.js
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../supabaseClient'
import styles from './Onboarding.module.css'

const GradingFrequency = ({ user, nextStep, prevStep }) => {
  const [selectedFrequency, setSelectedFrequency] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // If the user is not defined, navigate them to the login page
    if (!user) {
      console.error('User is not defined, redirecting to login.')
      navigate('/login')
      return // Stop execution of further code
    }

    // Fetch grading frequency from the database
    const fetchGradingFrequency = async () => {
      try {
        const { data, error } = await supabase
          .from('gpa_grading_frequency')
          .select('frequency')
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error('Error fetching grading frequency:', error.message)
        } else if (data) {
          setSelectedFrequency(data.frequency)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
      }
    }

    // Only fetch if user is present
    if (user) {
      fetchGradingFrequency()
    }
  }, [user, navigate])

  const handleSelectFrequency = (frequency) => {
    setSelectedFrequency(frequency)
  }

  const email = user?.email

  const handleNextStep = async () => {
    if (!email) {
      setError('Email is required but not available.')
      return
    }

    try {
      const { error } = await supabase.from('gpa_grading_frequency').upsert(
        {
          user_id: user.id,
          frequency: selectedFrequency,
          email: email,
        },
        { onConflict: 'user_id' }
      )

      if (error) {
        console.error('Error saving grading frequency:', error.message)
        setError('Failed to save grading frequency. Please try again.')
      } else {
        nextStep() // Proceed to the next step
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className={styles['wizard-step-container']}>
      <h2 className={styles['step-heading']}>Choose Your Grading Frequency</h2>
      <p className={styles['step-description']}>
        How often would you like to track your progress? You can update this
        later.
      </p>

      <div className={styles['frequency-container']}>
        {['weekly', 'monthly', 'quarterly'].map((frequency) => (
          <button
            key={frequency}
            onClick={() => handleSelectFrequency(frequency)}
            className={`${styles['frequency-button']} ${
              selectedFrequency === frequency
                ? styles['frequency-selected']
                : ''
            }`}
          >
            {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
          </button>
        ))}
      </div>

      {selectedFrequency && (
        <p className={styles['frequency-description']}>
          {selectedFrequency === 'weekly' &&
            "We'll notify you to submit grades on Sunday each week."}
          {selectedFrequency === 'monthly' &&
            "We'll notify you to submit grades on the last day of each month."}
          {selectedFrequency === 'quarterly' &&
            "We'll notify you to submit grades on the last day of each quarter."}
        </p>
      )}

      {error && <p className={styles['error-message']}>{error}</p>}

      <div className={styles['button-container']}>
        <button
          onClick={prevStep}
          className={`${styles.button} ${styles['button-secondary']}`}
        >
          Back
        </button>
        <button
          onClick={handleNextStep}
          className={`${styles.button} ${styles['button-primary']}`}
          disabled={!selectedFrequency}
        >
          Next Step
        </button>
      </div>
    </div>
  )
}

export default GradingFrequency
