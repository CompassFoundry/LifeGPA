import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../../supabaseClient'
import GPAProgressChart from './GPAProgressChart'
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
  const [gpaHistory, setGpaHistory] = useState([])

  const fetchAllReports = useCallback(async () => {
    try {
      if (!user) return

      console.log('Fetching all report cards for user:', user.id)

      const { data, error } = await supabase
        .from('report_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching report cards:', error.message)
        return
      }

      if (data && data.length > 0) {
        setGpaHistory(
          data.map((report) => {
            const totalScore = report.report_data.reduce((sum, category) => {
              return sum + (gradeScale[category.grade] || 0)
            }, 0)
            const avgGpa = totalScore / report.report_data.length
            return {
              date: new Date(report.created_at).toLocaleDateString(),
              gpa: avgGpa,
            }
          })
        )

        const latestReport = data[data.length - 1]
        const previousReport = data.length > 1 ? data[data.length - 2] : null

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
    } catch (err) {
      console.error('Unexpected error fetching report cards:', err)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchAllReports()
    }
  }, [user, fetchAllReports])

  const handleLogReport = () => {
    navigate('/life-gpa/log-report')
  }

  const handleViewReportCards = () => {
    navigate('/life-gpa/view-reports')
  }

  const handleSettings = () => {
    navigate('/life-gpa/settings')
  }

  return (
    <div className={styles['home-container']}>
      <h1 className={styles['home-heading']}>Your Life GPA</h1>
      <div className={styles['gpa-container']}>
        {gpa !== null ? gpa : 'Calculating...'}
      </div>
      {gpaChange !== null && (
        <div className={styles['gpa-change']}>
          ({gpaChange > 0 ? '+' : ''}
          {gpaChange} since last report)
        </div>
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

      <div className={styles['settings-link']}>
        <p onClick={handleSettings} className={styles['settings-text']}>
          Life GPA Settings
        </p>
      </div>

      <div className={styles['chart-container']}>
        <h2 className={styles['chart-heading']}>Progress Over Time</h2>
        {gpaHistory.length >= 5 ? (
          <GPAProgressChart gpaHistory={gpaHistory} />
        ) : (
          <div className={styles['chart-placeholder']}>
            Keep logging reports to see your progress over time! Once you've
            logged at least five reports, we'll display this chart.
          </div>
        )}
      </div>
    </div>
  )
}

export default LifeGPAHome
