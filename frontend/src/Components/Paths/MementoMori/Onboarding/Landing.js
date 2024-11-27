import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Onboarding.module.css'

const MementoMoriLanding = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Memento Mori</h1>
      <p className={styles.description}>
        Reflect on the transient nature of life, and let that inspire you to
        live with purpose, gratitude, and presence.
      </p>
      <Link to='/memento-mori/onboarding'>
        <button className={styles.ctaButton}>Start Your Journey</button>
      </Link>
      <div className={styles.quoteSection}>
        <p className={styles.quote}>
          "You could leave life right now. Let that determine what you do and
          say and think."
        </p>
        <p className={styles.author}>- Marcus Aurelius, Meditations</p>
      </div>
    </div>
  )
}

export default MementoMoriLanding
