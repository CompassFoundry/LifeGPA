import React from 'react'
import styles from './Onboarding.module.css'

const GradingFrequency = ({ nextStep, prevStep }) => {
  return (
    <div className={styles['step-container']}>
      <h2 className={styles['step-heading']}>Choose Your Grading Frequency</h2>
      <p className={styles['step-description']}>
        How often would you like to track your progress? You can update this
        later.
      </p>

      {/* Navigation Buttons */}
      <div className={styles['button-container']}>
        <button
          onClick={prevStep}
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

export default GradingFrequency
