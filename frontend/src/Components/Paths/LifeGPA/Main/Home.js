import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../../supabaseClient'
import styles from './Main.module.css'

const gradeScale = {
  A: 4,
  'A-': 3.75,
  AB: 3.5,
  'B+': 3.25,
  B: 3,
  'B-': 2.75,
  BC: 2.5,
  'C+': 2.25,
  C: 2,
  D: 1,
  F: 0,
}

const LifeGPAHome = ({ user }) => {
  const navigate = useNavigate()
  const [gpa, setGpa] = useState(null)
  const [gpaChange, setGpaChange] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchLatestReport()
    } else {
      navigate('/life-gpa/onboarding')
    }
  }, [user])

  const fetchLatestReport = async () => {
    try {
      console.log('Fetching report cards for user:', user.id)

      const { data, error } = await supabase
        .from('report_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(2)

      if (error) {
        console.error('Error fetching report cards:', error.message)
        setError('Error fetching your data. Please try again.')
        setLoading(false)
        return
      }

      if (data && data.length > 0) {
        console.log('Fetched report cards:', data)
        const latestReport = data[0]
        const previousReport = data[1] || null

        if (latestReport && latestReport.report_data) {
          const grades = latestReport.report_data
          const totalScore = grades.reduce((sum, category) => {
            return sum + (gradeScale[category.grade] || 0)
          }, 0)
          const avgGpa = totalScore / grades.length
          setGpa(avgGpa.toFixed(2))

          if (previousReport && previousReport.report_data) {
            const prevGrades = previousReport.report_data
            const prevTotalScore = prevGrades.reduce((sum, category) => {
              return sum + (gradeScale[category.grade] || 0)
            }, 0)
            const prevAvgGpa = prevTotalScore / prevGrades.length
            const change = avgGpa - prevAvgGpa
            setGpaChange(change.toFixed(2))
          } else {
            setGpaChange(null)
          }
        }
      } else {
        console.log('No report cards found.')
        setGpa('No reports found')
        setGpaChange(null)
      }
      setLoading(false)
    } catch (err) {
      console.error('Unexpected error fetching report cards:', err)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleLogReport = () => {
    navigate('/life-gpa/log-report')
  }

  const handleViewReportCards = () => {
    navigate('/life-gpa/report-cards')
  }

  if (loading) {
    return (
      <div className={styles['spinner-container']}>
        <div className={styles['spinner']}></div>
      </div>
    )
  }

  return (
    <div className={styles['home-container']}>
      <h1 className={styles['home-heading']}>Your Life GPA</h1>
      {error && <div className={styles['error-message']}>{error}</div>}
      {!error && (
        <>
          <div className={styles['gpa-container']}>
            {typeof gpa === 'string' && gpa === 'No reports found' ? (
              <div className={styles['no-report-message']}>
                You have not yet logged any reports. Please start by logging
                your first report.
              </div>
            ) : (
              gpa
            )}
          </div>
          {gpaChange !== null && (
            <div className={styles['gpa-change']}>
              ({gpaChange > 0 ? '+' : ''}
              {gpaChange} since last report)
            </div>
          )}
        </>
      )}

      <div className={styles['button-container']}>
        <button
          className={`${styles.button} ${styles['button-secondary']}`}
          onClick={handleViewReportCards}
        >
          View Report Cards
        </button>
        <button
          className={`${styles.button} ${styles['button-primary']}`}
          onClick={handleLogReport}
        >
          Log New Report
        </button>
      </div>

      <div className={styles['chart-container']}>
        <h2 className={styles['chart-heading']}>Progress Over Time</h2>
        <div className={styles['chart-placeholder']}>
          {/* Placeholder for charts (replace with real charts later) */}
          Charts will be displayed here once available.
        </div>
      </div>
    </div>
  )
}

export default LifeGPAHome
