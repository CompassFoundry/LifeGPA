import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Main.module.css'

const LifeGPASettings = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/life-gpa/home')
  }

  return (
    <div className={styles['settings-container']}>
      <h1 className={styles['settings-heading']}>Life GPA Settings</h1>
      <p className={styles['settings-description']}>
        Update your Life GPA categories and reporting frequency.
      </p>

      <div className={styles['button-container']}>
        <button
          className={`${styles.button} ${styles['button-secondary']}`}
          onClick={handleBack}
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default LifeGPASettings
