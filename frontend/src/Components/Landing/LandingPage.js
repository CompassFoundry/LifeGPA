// src/Components/LandingPage.js
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './Landing.module.css'

const LandingPage = () => {
  return (
    <div className={styles.container}>
      {/* Animated Header Section */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>
          Welcome to <span className={styles.highlight}>Life GPA</span>
        </h1>
        <p>
          Track your progress in the categories of life that matter{' '}
          <span className={styles.highlight}>most</span> to you.
        </p>
      </motion.div>

      {/* Call to Action Buttons */}
      <motion.div
        className={styles.buttons}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <Link to='/register'>
          <motion.button className={styles.button}>Sign Up</motion.button>
        </Link>
        <Link to='/login'>
          <motion.button className={`${styles.button} ${styles.secondary}`}>
            Login
          </motion.button>
        </Link>
      </motion.div>

      {/* Visual Illustration */}
      <motion.div
        className={styles.illustration}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <img
          src='/images/landing-illustration.svg'
          alt='Life GPA Illustration'
          className={styles.image}
        />
      </motion.div>
    </div>
  )
}

export default LandingPage
