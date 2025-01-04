import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../supabaseClient'
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

const ChooseCategories = ({ user, nextStep }) => {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      console.error('User is not defined, redirecting to login.')
      navigate('/login')
      return
    }

    const fetchSavedCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('gpa_categories')
          .select('category_name')
          .eq('user_id', user.id)

        if (error) {
          console.error('Error fetching categories:', error.message)
          setError('Failed to fetch categories. Please try again.')
        } else if (data) {
          const fetchedCategories = data.map((item) => item.category_name)
          setSelectedCategories(fetchedCategories)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('An unexpected error occurred. Please try again.')
      }
    }

    fetchSavedCategories()
  }, [user, navigate])

  const toggleCategory = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((cat) => cat !== category)
        : [...prevSelected, category]
    )
  }

  const isNextStepDisabled = selectedCategories.length < 3

  const handleAddCategory = () => {
    if (newCategory && !selectedCategories.includes(newCategory)) {
      setSelectedCategories((prevSelected) => [...prevSelected, newCategory])
      setNewCategory('')
    }
  }

  const handleNextStep = async () => {
    try {
      // Fetch currently saved categories from the database
      const { data, error: fetchError } = await supabase
        .from('gpa_categories')
        .select('category_name')
        .eq('user_id', user.id)

      if (fetchError) {
        console.error('Error fetching categories:', fetchError.message)
        setError('Failed to fetch categories. Please try again.')
        return
      }

      const existingCategories = data.map((item) => item.category_name)

      // Determine which categories to add and which to remove
      const categoriesToAdd = selectedCategories.filter(
        (cat) => !existingCategories.includes(cat)
      )
      const categoriesToRemove = existingCategories.filter(
        (cat) => !selectedCategories.includes(cat)
      )

      // Add new categories
      if (categoriesToAdd.length > 0) {
        const { error: insertError } = await supabase
          .from('gpa_categories')
          .insert(
            categoriesToAdd.map((category) => ({
              user_id: user.id,
              category_name: category,
            }))
          )

        if (insertError) {
          console.error('Error adding categories:', insertError.message)
          setError('Failed to save new categories. Please try again.')
          return
        }
      }

      // Remove deselected categories
      if (categoriesToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from('gpa_categories')
          .delete()
          .eq('user_id', user.id)
          .in('category_name', categoriesToRemove)

        if (deleteError) {
          console.error('Error deleting categories:', deleteError.message)
          setError('Failed to remove categories. Please try again.')
          return
        }
      }

      nextStep() // Proceed to the next step
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
    }
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
        {categoriesList
          .concat(
            selectedCategories.filter((cat) => !categoriesList.includes(cat))
          )
          .map((category) => (
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

      <div className={styles['add-category-container']}>
        <input
          type='text'
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder='Add your own category'
          className={styles['custom-category-input']}
        />
        <button onClick={handleAddCategory} className={styles['button']}>
          Add
        </button>
      </div>

      {error && <p className={styles['error-message']}>{error}</p>}

      <div className={styles['button-container']}>
        <button
          onClick={() => navigate('/life-gpa')}
          className={`${styles.button} ${styles['button-secondary']}`}
        >
          Back
        </button>
        <button
          onClick={handleNextStep}
          className={`${styles.button} ${styles['button-primary']}`}
          disabled={isNextStepDisabled}
        >
          Next Step
        </button>
      </div>
    </div>
  )
}

export default ChooseCategories
