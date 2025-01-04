import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Auth.module.css'

const TermsOfService = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Terms of Service</h1>

      <p className={styles.paragraph}>
        Welcome to Strive. By accessing or using our services, you agree to be
        bound by the following terms and conditions. If you do not agree, you
        may not use our platform.
      </p>

      <h2 className={styles.subheading}>1. Acceptance of Terms</h2>
      <p className={styles.paragraph}>
        These Terms of Service ("Terms") constitute a legally binding agreement
        between you ("User") and Compass Foundry LLC (DBA Strive). ("Company,"
        "we," or "us"). By using our platform, you confirm that you have read,
        understood, and agree to these Terms.
      </p>

      <h2 className={styles.subheading}>2. Eligibility</h2>
      <p className={styles.paragraph}>
        You must be at least 18 years of age or the age of majority in your
        jurisdiction to use our services. By registering an account, you affirm
        that you meet these requirements.
      </p>

      <h2 className={styles.subheading}>3. User Responsibilities</h2>
      <p className={styles.paragraph}>Users agree to:</p>
      <ul className={styles.list}>
        <li>
          Provide accurate and up-to-date information during registration and
          account use.
        </li>
        <li>Maintain the confidentiality of their account credentials.</li>
        <li>
          Refrain from using our platform for unlawful activities, harassment,
          or spreading malicious content.
        </li>
      </ul>

      <h2 className={styles.subheading}>4. Intellectual Property</h2>
      <p className={styles.paragraph}>
        All content, trademarks, logos, and other intellectual property on our
        platform are owned by Company or licensed to us. Users are prohibited
        from copying, distributing, or using our intellectual property without
        explicit permission.
      </p>

      <h2 className={styles.subheading}>5. Prohibited Activities</h2>
      <p className={styles.paragraph}>Users may not:</p>
      <ul className={styles.list}>
        <li>
          Engage in activities that disrupt or damage our services or
          infrastructure.
        </li>
        <li>
          Attempt to gain unauthorized access to our systems or user accounts.
        </li>
        <li>
          Upload or share content that is obscene, defamatory, or violates the
          rights of others.
        </li>
      </ul>

      <h2 className={styles.subheading}>6. Limitation of Liability</h2>
      <p className={styles.paragraph}>
        To the fullest extent permitted by law, Company is not liable for any
        damages arising from your use of our services. This includes, but is not
        limited to, indirect, incidental, or consequential damages.
      </p>

      <h2 className={styles.subheading}>7. Privacy Policy</h2>
      <p className={styles.paragraph}>
        Your use of our platform is also governed by our Privacy Policy, which
        explains how we collect, use, and protect your data. By using our
        services, you consent to our data practices as outlined in the Privacy
        Policy.
      </p>

      <h2 className={styles.subheading}>8. Modifications to Terms</h2>
      <p className={styles.paragraph}>
        We reserve the right to update these Terms at any time. Changes will be
        effective immediately upon posting on our website. Continued use of our
        services constitutes your acceptance of the updated Terms.
      </p>

      <h2 className={styles.subheading}>9. Governing Law</h2>
      <p className={styles.paragraph}>
        These Terms are governed by the laws of the United States and the state
        in which Company is headquartered. Any disputes will be resolved in the
        courts of that jurisdiction.
      </p>

      <h2 className={styles.subheading}>10. Contact Information</h2>
      <p className={styles.paragraph}>
        If you have any questions about these Terms, please contact us at
        support@compassfoundry.com.
      </p>

      <Link to='/login' className={styles.backLink}>
        Return to Login
      </Link>
    </div>
  )
}

export default TermsOfService
