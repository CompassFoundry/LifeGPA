import React, { useState, useEffect } from 'react'
import ChooseCategories from './ChooseCategories'
import GradingFrequency from './GradingFrequency'
import Baseline from './Baseline'
import styles from './Onboarding.module.css'
import { useNavigate } from 'react-router-dom'

const Overview = ({ user, setHasReportCard }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      // If user is not defined, redirect to login
      navigate('/login')
    }
  }, [user, navigate])

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ChooseCategories
            nextStep={nextStep}
            prevStep={prevStep}
            user={user} // Pass user to all components in case it's needed
          />
        )
      case 2:
        return (
          <GradingFrequency
            nextStep={nextStep}
            prevStep={prevStep}
            user={user}
          />
        )
      case 3:
        return (
          <Baseline
            user={user}
            prevStep={prevStep}
            nextStep={nextStep} // It can help with navigation flow within the Baseline component
            setHasReportCard={setHasReportCard} // Ensure it gets passed down correctly
          />
        )
      default:
        return (
          <ChooseCategories
            nextStep={nextStep}
            prevStep={prevStep}
            user={user}
          />
        )
    }
  }

  if (!user) {
    return null // Prevent rendering until user is available
  }

  return (
    <div className={styles['wizard-container']}>
      <div className={styles['progress-bar']} style={{ '--step': currentStep }}>
        Step {currentStep} of 3
      </div>
      <div className={styles['page-padding']}>{renderStep()}</div>
    </div>
  )
}

export default Overview
