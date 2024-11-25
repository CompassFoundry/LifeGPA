import React from 'react'
import styles from './Onboarding.module.css'

const Baseline = ({ prevStep }) => {
  return (
    <div className={styles['step-container']}>
      <h2 className={styles['step-heading']}>Baseline Grade Report</h2>
      <p className={styles['step-description']}>
        Set a baseline for yourself by grading your life today.
      </p>

      {/* Example content - Add more fields as necessary */}

      {/* Navigation Buttons */}
      <div className={styles['button-container']}>
        <button
          onClick={prevStep}
          className={`${styles.button} ${styles['button-secondary']}`}
        >
          Back
        </button>
        <button className={`${styles.button} ${styles['button-primary']}`}>
          Submit
        </button>
      </div>
    </div>
  )
}

export default Baseline
