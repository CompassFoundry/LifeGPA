import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Let's Get Started</h1>
      <h3 className={styles.subheading}>Choose Your Path</h3>
      <div className={styles.cardsWrapper}>
        <Link to='/life-gpa' className={styles.card}>
          <p className={styles.cardText}>Life GPA</p>
        </Link>
        <Link to='/identity' className={styles.cardDisabled}>
          <p className={styles.cardTextDisabled}>Identity Map</p>
        </Link>
      </div>
    </div>
  )
}

export default Home
