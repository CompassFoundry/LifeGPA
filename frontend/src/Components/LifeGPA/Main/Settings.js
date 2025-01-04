import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../supabaseClient'
import styles from '../Onboarding/Onboarding.module.css'

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

const LifeGPASettings = ({ user }) => {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [selectedFrequency, setSelectedFrequency] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSavedData = async () => {
      if (!user) return

      try {
        // Fetch saved categories
        const { data: categoryData, error: categoryError } = await supabase
          .from('gpa_categories')
          .select('category_name')
          .eq('user_id', user.id)

        if (categoryError) {
          console.error('Error fetching categories:', categoryError.message)
          setError('Failed to fetch categories. Please try again.')
        } else if (categoryData) {
          const fetchedCategories = categoryData.map(
            (item) => item.category_name
          )
          setSelectedCategories(fetchedCategories)
        }

        // Fetch grading frequency
        const { data: frequencyData, error: frequencyError } = await supabase
          .from('gpa_grading_frequency')
          .select('frequency')
          .eq('user_id', user.id)
          .single()

        if (frequencyError) {
          console.error(
            'Error fetching grading frequency:',
            frequencyError.message
          )
        } else if (frequencyData) {
          setSelectedFrequency(frequencyData.frequency)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('An unexpected error occurred. Please try again.')
      }
    }

    fetchSavedData()
  }, [user])

  const toggleCategory = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((cat) => cat !== category)
        : [...prevSelected, category]
    )
  }

  const handleAddCategory = () => {
    if (newCategory && !selectedCategories.includes(newCategory)) {
      setSelectedCategories((prevSelected) => [...prevSelected, newCategory])
      setNewCategory('')
    }
  }

  const handleSaveSettings = async () => {
    try {
      // Save categories
      const { data: categoryData, error: categoryFetchError } = await supabase
        .from('gpa_categories')
        .select('category_name')
        .eq('user_id', user.id)

      if (categoryFetchError) {
        console.error('Error fetching categories:', categoryFetchError.message)
        setError('Failed to fetch categories. Please try again.')
        return
      }

      const existingCategories = categoryData.map((item) => item.category_name)

      const categoriesToAdd = selectedCategories.filter(
        (cat) => !existingCategories.includes(cat)
      )
      const categoriesToRemove = existingCategories.filter(
        (cat) => !selectedCategories.includes(cat)
      )

      if (categoriesToAdd.length > 0) {
        const { error: insertError } = await supabase
          .from('gpa_categories')
          .insert(
            categoriesToAdd.map((category) => ({
              user_id: user.id,
              category_name: category,
              updated_at: new Date().toISOString(), // Add timestamp
            }))
          )

        if (insertError) {
          console.error('Error adding categories:', insertError.message)
          setError('Failed to save new categories. Please try again.')
          return
        }
      }

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

      // Save grading frequency
      const { error: frequencyError } = await supabase
        .from('gpa_grading_frequency')
        .upsert(
          {
            user_id: user.id,
            frequency: selectedFrequency,
            updated_at: new Date().toISOString(), // Add timestamp
          },
          { onConflict: 'user_id' }
        )

      if (frequencyError) {
        console.error('Error saving grading frequency:', frequencyError.message)
        setError('Failed to save grading frequency. Please try again.')
        return
      }

      setMessage('Settings updated successfully!')
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const handleSelectFrequency = (frequency) => {
    setSelectedFrequency(frequency)
  }

  const handleBack = () => {
    navigate('/life-gpa/home')
  }

  return (
    <div className={styles['settings-container']}>
      <h2 className={styles['settings-heading']}>Life GPA Settings</h2>

      {/* Categories Section */}
      <div className={styles['section-container']}>
        <h3 className={styles['section-heading']}>Categories</h3>
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
      </div>

      {/* Grading Frequency Section */}
      <div className={styles['section-container']}>
        <h3 className={styles['section-heading']}>Grading Frequency</h3>
        <div className={styles['frequency-container']}>
          {['weekly', 'monthly', 'quarterly'].map((frequency) => (
            <button
              key={frequency}
              onClick={() => handleSelectFrequency(frequency)}
              className={`${styles['frequency-button']} ${
                selectedFrequency === frequency
                  ? styles['frequency-selected']
                  : ''
              }`}
            >
              {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
            </button>
          ))}
        </div>

        {selectedFrequency && (
          <p className={styles['frequency-description']}>
            {selectedFrequency === 'weekly' &&
              "We'll notify you to submit grades on Sunday each week."}
            {selectedFrequency === 'monthly' &&
              "We'll notify you to submit grades on the last day of each month."}
            {selectedFrequency === 'quarterly' &&
              "We'll notify you to submit grades on the last day of each quarter."}
          </p>
        )}
      </div>

      {error && <p className={styles['error-message']}>{error}</p>}
      {message && <p className={styles['success-message']}>{message}</p>}

      <div className={styles['button-container']}>
        <button
          onClick={handleBack}
          className={`${styles.button} ${styles['button-secondary']}`}
        >
          Back
        </button>
        <button
          onClick={handleSaveSettings}
          className={`${styles.button} ${styles['button-primary']}`}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default LifeGPASettings
