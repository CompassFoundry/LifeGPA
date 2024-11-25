import React from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate for navigation
import styles from './Onboarding.module.css'

const ChooseCategories = ({ nextStep }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    // If user is on step 1, go back to the Life GPA Landing page
    navigate('/life-gpa')
  }

  return (
    <div className={styles['step-container']}>
      <h2 className={styles['step-heading']}>Choose Your Categories</h2>
      <p className={styles['step-description']}>
        Choose the categories you wish to track in your Life GPA. You can update
        these later.
      </p>

      {/* Navigation Buttons */}
      <div className={styles['button-container']}>
        <button
          onClick={handleBack}
          className={`${styles.button} ${styles['button-secondary']}`}
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className={`${styles.button} ${styles['button-primary']}`}
        >
          Next Step
        </button>
      </div>
    </div>
  )
}

export default ChooseCategories
