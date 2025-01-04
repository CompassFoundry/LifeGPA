import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../supabaseClient'
import LoadingSpinner from '@components/Global/LoadingSpinner'
import styles from './Main.module.css'
import ReportDetailsModal from './ReportDetailsModal'

const ViewReports = ({ user }) => {
  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null) // For modal
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (!user) return

        const { data, error } = await supabase
          .from('report_cards')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching report cards:', error.message)
        } else {
          setReports(data)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [user])

  // Helper function to navigate back to Life GPA home page
  const handleBack = () => {
    navigate('/life-gpa/home')
  }

  // Helper function to calculate GPA from report data
  const calculateGPA = (reportData) => {
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

    if (!reportData || reportData.length === 0) return 0

    const totalScore = reportData.reduce(
      (sum, category) => sum + (gradeScale[category.grade] || 0),
      0
    )

    return totalScore / reportData.length
  }

  // Display a loading spinner while fetching data
  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className={styles['view-reports-container']}>
      <h2 className={styles['view-reports-heading']}>Your Report Cards</h2>
      <div className={styles['reports-list']}>
        {reports.length > 0 ? (
          reports.map((report) => (
            <div
              key={report.id}
              className={styles['report-card']}
              onClick={() => setSelectedReport(report)}
            >
              <p className={styles['report-date']}>
                {new Date(report.created_at).toLocaleDateString()}
              </p>
              <p className={styles['report-gpa']}>
                GPA: {calculateGPA(report.report_data).toFixed(2)}
              </p>
            </div>
          ))
        ) : (
          <p>No report cards found.</p>
        )}
      </div>

      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}

      {/* Back Button */}
      <div className={styles['button-container']}>
        <button
          onClick={handleBack}
          className={`${styles.button} ${styles['button-secondary']}`}
        >
          Back
        </button>
      </div>
    </div>
  )
}

export default ViewReports
