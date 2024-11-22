import React from 'react'
import styles from './Home.module.css' // Import the CSS module

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Let's Get Started</h1>
      <h3 className={styles.subheading}>Choose Your Paths</h3>
      <div className={styles.card}>
        <p className={styles.cardText}>Life GPA</p>
      </div>
    </div>
  )
}

export default Home
