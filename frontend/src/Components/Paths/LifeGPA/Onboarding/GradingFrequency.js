import React, { useState, useEffect } from 'react'
import { supabase } from '../../../../supabaseClient'
import styles from './Onboarding.module.css'

const GradingFrequency = ({ user, nextStep, prevStep }) => {
  const [selectedFrequency, setSelectedFrequency] = useState('')
  const [error, setError] = useState('')

  // Fetch existing frequency preference from the database
  useEffect(() => {
    const fetchFrequency = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('gpa_grading_frequency')
          .select('frequency')
          .eq('user_id', user.id)
          .single()

        if (error && error.details !== 'No rows found') {
          console.error('Error fetching frequency:', error.message)
        } else if (data) {
          setSelectedFrequency(data.frequency)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
      }
    }

    fetchFrequency()
  }, [user])

  const handleFrequencyChange = (frequency) => {
    setSelectedFrequency(frequency)
  }

  const handleNextStep = async () => {
    try {
      // Insert or update frequency in the database
      const { error } = await supabase.from('gpa_grading_frequency').upsert(
        {
          user_id: user.id,
          frequency: selectedFrequency,
        },
        { onConflict: 'user_id' } // Ensure no duplicate entries per user
      )

      if (error) {
        console.error('Error saving frequency:', error.message)
        setError('Failed to save frequency. Please try again.')
      } else {
        nextStep()
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
        How often would you like to track your progress?
      </p>

      <div className={styles['frequency-container']}>
        {['weekly', 'monthly', 'quarterly'].map((frequency) => (
          <button
            key={frequency}
            className={`${styles['frequency-button']} ${
              selectedFrequency === frequency
                ? styles['frequency-selected']
                : ''
            }`}
            onClick={() => handleFrequencyChange(frequency)}
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
