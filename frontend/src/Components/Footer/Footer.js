import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.logoContainer}>
        <img
          src='/images/logo.png'
          alt='Life GPA Logo'
          className={styles.logo}
        />
      </div>
      <div className={styles.links}>
        <Link to='/terms-of-service' className={styles.link}>
          Terms of Service
        </Link>
        <Link to='/privacy-policy' className={styles.link}>
          Privacy Policy
        </Link>
        <Link to='/contact' className={styles.link}>
          Contact Us
        </Link>
      </div>
      <p className={styles.copyright}>
        &copy; {new Date().getFullYear()} Life GPA. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
