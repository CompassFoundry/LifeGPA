import React, { useState } from 'react'
import styles from './Contact.module.css'

const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/contact/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, message }),
        }
      )

      if (response.ok) {
        setSuccessMessage('Thank you! Your message has been submitted.')
        setErrorMessage('')
        setName('')
        setEmail('')
        setMessage('')
      } else {
        const data = await response.json()
        setErrorMessage(
          data.error || 'Failed to submit the form. Please try again.'
        )
        setSuccessMessage('')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      setErrorMessage('An unexpected error occurred. Please try again.')
      setSuccessMessage('')
    }
  }

  return (
    <div className={styles.contactContainer}>
      <h1 className={styles.heading}>Contact Us</h1>
      <p className={styles.description}>
        Have questions or feedback? We'd love to hear from you!
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor='name' className={styles.label}>
            Name:
          </label>
          <input
            type='text'
            id='name'
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='Your name'
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor='email' className={styles.label}>
            Email:
          </label>
          <input
            type='email'
            id='email'
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='Your email'
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor='message' className={styles.label}>
            Message:
          </label>
          <textarea
            id='message'
            className={styles.textarea}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder='Your message'
          ></textarea>
        </div>
        <button type='submit' className={styles.button}>
          Submit
        </button>
      </form>
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  )
}

export default Contact
