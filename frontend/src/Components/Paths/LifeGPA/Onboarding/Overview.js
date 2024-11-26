import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChooseCategories from './ChooseCategories'
import GradingFrequency from './GradingFrequency'
import Baseline from './Baseline'
import styles from './Onboarding.module.css'

const Overview = ({ user }) => {
  const [currentStep, setCurrentStep] = useState(1) // Step tracking, starting at 1
  const navigate = useNavigate()

  // Redirect to login if the user is not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  // Render steps based on the currentStep value
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ChooseCategories
            user={user}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 2:
        return (
          <GradingFrequency
            user={user}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 3:
        return <Baseline user={user} prevStep={prevStep} />
      default:
        return (
          <ChooseCategories
            user={user}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
    }
  }

  // Render the onboarding flow if the user is logged in
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
