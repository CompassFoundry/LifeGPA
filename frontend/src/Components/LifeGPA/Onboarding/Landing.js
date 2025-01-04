import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Onboarding.module.css'

const Landing = () => {
  return (
    <div className={styles['landing-container']}>
      <h1 className={styles['landing-heading']}>Welcome to Life GPA</h1>
      <p className={styles['landing-description']}>
        Life GPA is a tool that lets you track the things that matter most in
        your life and grade your progress over time.
      </p>
      <Link to='/home'>
        <button className={`${styles['cta-button']} ${styles['secondary']}`}>
          Cancel
        </button>
      </Link>
      <Link to='/life-gpa/onboarding'>
        <button className={styles['cta-button']}>Get Started</button>
      </Link>
    </div>
  )
}

export default Landing
