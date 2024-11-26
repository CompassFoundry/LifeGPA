import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Onboarding.module.css'

const categoriesList = [
  'Relationships',
  'Work',
  'Personal Finance',
  'Fitness',
  'Hobbies',
  'Mental Health',
  'Spirituality',
  'Learning',
  'Community Involvement',
  'Health & Wellness',
  'Creativity',
  'Self-Care',
]

const ChooseCategories = ({ nextStep }) => {
  const [selectedCategories, setSelectedCategories] = useState([])

  const toggleCategory = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((cat) => cat !== category)
        : [...prevSelected, category]
    )
  }

  const isNextStepDisabled = selectedCategories.length < 3

  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/life-gpa') // Navigate back to the Life GPA landing page
  }

  return (
    <div className={styles['wizard-step-container']}>
      <h2 className={styles['step-heading']}>Choose Your Categories</h2>
      <p className={styles['step-description']}>
        Choose the categories you wish to track in your Life GPA. You can update
        these later.
      </p>
      <p className={styles['instruction-text']}>
        Please select at least three categories.
      </p>

      <div className={styles['categories-container']}>
        {categoriesList.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`${styles['category-button']} ${
              selectedCategories.includes(category)
                ? styles['category-selected']
                : ''
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles['button-container']}>
        <button
          onClick={handleBack}
          className={`${styles.button} ${styles['button-secondary']}`}
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className={`${styles.button} ${styles['button-primary']} ${
            isNextStepDisabled ? styles['disabled-button'] : ''
          }`}
          disabled={isNextStepDisabled}
        >
          Next Step
        </button>
      </div>
    </div>
  )
}

export default ChooseCategories
