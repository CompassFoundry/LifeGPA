// src/Components/LandingPage.js
import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Landing.module.css'

const LandingPage = () => {
  return (
    <div className={styles.header}>
      <h1>Welcome to Thrive</h1>
      <p>Track your progress in the categories of life that matter to you.</p>
      <Link to='/register'>
        <button className={styles.button}>Sign Up</button>
      </Link>
      <Link to='/login'>
        <button className={styles.button}>Login</button>
      </Link>
    </div>
  )
}

export default LandingPage
