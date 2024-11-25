import React from 'react'
import styles from '../Paths.module.css' // Import the CSS module

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Identity</h1>
      <h3 className={styles.subheading}>Who are you? Who do you want to be?</h3>
    </div>
  )
}

export default Home
