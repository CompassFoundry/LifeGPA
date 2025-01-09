import React from 'react'
import styles from './Main.module.css'

const ReportDetailsModal = ({ report, onClose }) => {
  // Function to handle clicks outside of the modal content
  const handleBackdropClick = (event) => {
    // Check if the clicked target is the backdrop itself (not the modal content)
    if (event.target.classList.contains('modalOverlay')) {
      onClose() // Close the modal
    }
  }

  return (
    <div className='modalOverlay' onClick={handleBackdropClick}>
      <div className='modal'>
        <button className='modalClose' onClick={onClose}>
          &times;
        </button>
        <h2 className='modalHeading'>Report Details</h2>
        <div className='modalBody'>
          {report &&
            report.report_data.map((item, index) => (
              <div key={index} className={styles['report-item']}>
                <h4 className={styles['report-category']}>
                  {item.category_name}
                </h4>
                <p className={styles['report-grade']}>Grade: {item.grade}</p>
                {item.description && (
                  <p className={styles['report-description']}>
                    Description: {item.description}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ReportDetailsModal
