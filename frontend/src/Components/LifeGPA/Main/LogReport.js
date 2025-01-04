import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../supabaseClient'
import styles from './Main.module.css'

const gradesOptions = [
  'A',
  'A-',
  'AB',
  'B+',
  'B',
  'B-',
  'BC',
  'C+',
  'C',
  'D',
  'F',
]

const LogReport = ({ user, setHasReportCard }) => {
  const [categories, setCategories] = useState([])
  const [grades, setGrades] = useState({})
  const [descriptions, setDescriptions] = useState({})
  const [error, setError] = useState('')
  const navigate = useNavigate() // Using React Router's navigate hook

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) {
        console.error('User is not defined, redirecting to login.')
        navigate('/login')
        return
      }

      try {
        const { data, error } = await supabase
          .from('gpa_categories')
          .select('id, category_name')
          .eq('user_id', user.id)

        if (error) {
          console.error('Error fetching categories:', error.message)
        } else {
          setCategories(
            data.map((item) => ({ id: item.id, name: item.category_name }))
          )
        }
      } catch (err) {
        console.error('Unexpected error:', err)
      }
    }

    fetchCategories()
  }, [user, navigate])

  const handleGradeChange = (categoryId, grade) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [categoryId]: grade,
    }))
  }

  const handleDescriptionChange = (categoryId, description) => {
    setDescriptions((prevDescriptions) => ({
      ...prevDescriptions,
      [categoryId]: description,
    }))
  }

  const isSubmitEnabled =
    categories.length > 0 && Object.keys(grades).length === categories.length

  const handleSubmit = async () => {
    try {
      const payload = {
        user_id: user.id,
        report_data: categories.map((category) => ({
          category_id: category.id,
          category_name: category.name,
          grade: grades[category.id],
          description: descriptions[category.id] || '',
        })),
      }

      const { error } = await supabase.from('report_cards').insert(payload)

      if (error) {
        console.error('Error saving new report:', error.message)
        setError('Failed to save new report. Please try again.')
      } else {
        // Update the hasReportCard state
        setHasReportCard(true)

        // Navigate back to the Life GPA home page
        navigate('/life-gpa/home')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const handleBack = () => {
    // This function navigates back to the Life GPA home page
    navigate('/life-gpa/home')
  }

  return (
    <div className={styles['log-report-container']}>
      <h2 className={styles['log-report-heading']}>Log a New Report</h2>
      <p className={styles['log-report-description']}>
        Log your new grades to track progress over time.
      </p>

      <div className={styles['grades-container']}>
        {categories.map((category) => (
          <div key={category.id} className={styles['category-item']}>
            <label
              className={styles['category-label']}
              htmlFor={`grade-${category.id}`}
            >
              {category.name}
            </label>
            <div className={styles['input-row']}>
              <div className={styles['select-wrapper']}>
                <select
                  id={`grade-${category.id}`}
                  className={styles['grade-select']}
                  value={grades[category.id] || ''}
                  onChange={(e) =>
                    handleGradeChange(category.id, e.target.value)
                  }
                >
                  <option value='' disabled>
                    Select Grade
                  </option>
                  {gradesOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                className={styles['description-input']}
                placeholder='Add a description for your grade (optional)'
                value={descriptions[category.id] || ''}
                onChange={(e) =>
                  handleDescriptionChange(category.id, e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>

      {error && <p className={styles['error-message']}>{error}</p>}

      <div className={styles['button-container']}>
        <button
          onClick={handleBack}
          className={`${styles.button} ${styles['button-secondary']}`}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className={`${styles.button} ${styles['button-primary']}`}
          disabled={!isSubmitEnabled}
        >
          Submit Report
        </button>
      </div>
    </div>
  )
}

export default LogReport
