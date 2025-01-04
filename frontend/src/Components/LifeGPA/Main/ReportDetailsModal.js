import React from 'react'
import styles from './Modal.module.css'

const ReportDetailsModal = ({ report, onClose }) => {
  // Function to handle clicks outside of the modal content
  const handleBackdropClick = (event) => {
    // Check if the clicked target is the backdrop itself (not the modal content)
    if (event.target.classList.contains(styles['modal-backdrop'])) {
      onClose() // Close the modal
    }
  }

  return (
    <div className={styles['modal-backdrop']} onClick={handleBackdropClick}>
      <div className={styles['modal-content']}>
        <button className={styles['close-button']} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles['modal-heading']}>Report Details</h2>
        <div className={styles['modal-body']}>
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
