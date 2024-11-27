import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Onboarding.module.css'

const MementoMoriLanding = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Coming Soon</h1>
      <Link to='/home'>
        <button className={styles.ctaButton}>Return Home</button>
      </Link>
    </div>
  )
}

export default MementoMoriLanding
