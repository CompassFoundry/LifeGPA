import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Let's Get Started</h1>
      <h3 className={styles.subheading}>Choose Your Path</h3>
      <div className={styles.cardsWrapper}>
        {/* Active Cards */}
        <Link to='/life-gpa' className={styles.card}>
          <p className={styles.cardText}>Life GPA</p>
        </Link>
        <Link to='/memento-mori' className={styles.card}>
          <p className={styles.cardText}>Memento Mori</p>
        </Link>
        <Link to='/wage-watch' className={styles.card}>
          <p className={styles.cardText}>Wage Watch</p>
        </Link>

        {/* Disabled Card with "Coming Soon" subtext */}
        <div className={styles.cardDisabled}>
          <p className={styles.cardTextDisabled}>View from Above</p>
          <p className={styles.cardComingSoon}>Coming Soon!</p>
        </div>
        <div className={styles.cardDisabled}>
          <p className={styles.cardTextDisabled}>Regret Minimization</p>
          <p className={styles.cardComingSoon}>Coming Soon!</p>
        </div>
        <div className={styles.cardDisabled}>
          <p className={styles.cardTextDisabled}>Fear Setting</p>
          <p className={styles.cardComingSoon}>Coming Soon!</p>
        </div>
        <div className={styles.cardDisabled}>
          <p className={styles.cardTextDisabled}>Identity Map</p>
          <p className={styles.cardComingSoon}>Coming Soon!</p>
        </div>
        <div className={styles.cardDisabled}>
          <p className={styles.cardTextDisabled}>Hobby Tracker</p>
          <p className={styles.cardComingSoon}>Coming Soon!</p>
        </div>
        <div className={styles.cardDisabled}>
          <p className={styles.cardTextDisabled}>Habit Tracker</p>
          <p className={styles.cardComingSoon}>Coming Soon!</p>
        </div>
        <div className={styles.cardDisabled}>
          <p className={styles.cardTextDisabled}>Life Roadmap</p>
          <p className={styles.cardComingSoon}>Coming Soon!</p>
        </div>
        <div className={styles.cardDisabled}>
          <p className={styles.cardTextDisabled}>Education Tracker</p>
          <p className={styles.cardComingSoon}>Coming Soon!</p>
        </div>
      </div>
    </div>
  )
}

export default Home
