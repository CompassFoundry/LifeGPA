import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import { AuthContext } from '@components/Auth/AuthState'

const Home = () => {
  const { user } = useContext(AuthContext)

  if (!user) {
    return console.log('User not logged in')
  } else
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Let's Get Started</h1>
        <div className={styles.cardsWrapper}>
          {/* Active Cards */}
          <Link to='/life-gpa' className={styles.card}>
            <p className={styles.cardText}>Life GPA</p>
          </Link>
        </div>
      </div>
    )
}

export default Home
