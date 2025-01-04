import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Auth.module.css'

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Privacy Policy</h1>
      <p className={styles.paragraph}>
        At Compass Foundry LLC (DBA Thrive), your privacy is our priority. This
        Privacy Policy outlines how we collect, use, disclose, and protect your
        information in compliance with applicable U.S. laws, including the
        California Consumer Privacy Act (CCPA) and the General Data Protection
        Regulation (GDPR).
      </p>
      <h2 className={styles.subheading}>1. Information We Collect</h2>
      <p className={styles.paragraph}>
        We may collect the following types of information when you use our
        services:
      </p>
      <ul className={styles.list}>
        <li>
          <strong>Personal Information:</strong> Name, email address, phone
          number, age, and billing details.
        </li>
        <li>
          <strong>Usage Data:</strong> IP address, browser type, pages visited,
          and other analytical information.
        </li>
        <li>
          <strong>Cookies:</strong> Data collected through cookies and similar
          tracking technologies.
        </li>
      </ul>
      <h2 className={styles.subheading}>2. How We Use Your Information</h2>
      <p className={styles.paragraph}>
        We use your information for the following purposes:
      </p>
      <ul className={styles.list}>
        <li>To provide and improve our services.</li>
        <li>
          To personalize your experience and enhance platform functionality.
        </li>
        <li>
          To communicate updates, promotional offers, and respond to inquiries.
        </li>
        <li>
          To ensure compliance with legal obligations and protect against
          fraudulent activities.
        </li>
      </ul>
      <h2 className={styles.subheading}>3. Sharing Your Information</h2>
      <p className={styles.paragraph}>
        Compass Foundry LLC does not sell your personal information. However, we
        may share your data with:
      </p>
      <ul className={styles.list}>
        <li>
          Service providers that assist us in delivering our services (e.g.,
          payment processors).
        </li>
        <li>
          Legal authorities if required by law or to protect our rights and
          users' safety.
        </li>
        <li>
          Partners for analytics and marketing, provided appropriate agreements
          are in place.
        </li>
      </ul>
      <h2 className={styles.subheading}>4. Data Retention</h2>
      <p className={styles.paragraph}>
        We retain your data only as long as necessary to fulfill the purposes
        outlined in this policy or as required by law.
      </p>
      <h2 className={styles.subheading}>5. Your Rights</h2>
      <p className={styles.paragraph}>
        As a user, you have the following rights under U.S. privacy laws:
      </p>
      <ul className={styles.list}>
        <li>Access your data and request a copy.</li>
        <li>Correct inaccuracies in your data.</li>
        <li>Request deletion of your data, subject to legal requirements.</li>
        <li>Opt-out of data sharing for targeted advertising.</li>
      </ul>
      To exercise these rights, contact us at{' '}
      <strong>privacy@compassfoundry.com</strong>.
      <h2 className={styles.subheading}>6. Security Measures</h2>
      <p className={styles.paragraph}>
        We implement robust security measures to protect your data, including
        encryption, secure servers, and regular security audits. However, no
        system is completely secure, and we cannot guarantee absolute data
        security.
      </p>
      <h2 className={styles.subheading}>7. Changes to This Policy</h2>
      <p className={styles.paragraph}>
        Compass Foundry LLC reserves the right to update this Privacy Policy.
        Changes will be communicated via email or a prominent notice on our
        platform. Continued use of our services constitutes acceptance of the
        updated policy.
      </p>
      <h2 className={styles.subheading}>8. Contact Information</h2>
      <p className={styles.paragraph}>
        If you have any questions or concerns about this Privacy Policy, please
        contact us at:
        <strong> privacy@compassfoundry.com</strong>.
      </p>
      <Link to='/login' className={styles.backLink}>
        Return to Login
      </Link>
    </div>
  )
}

export default PrivacyPolicy
