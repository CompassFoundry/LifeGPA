import React, { useState } from 'react'
import ChooseCategories from './ChooseCategories'
import GradingFrequency from './GradingFrequency'
import Baseline from './Baseline'
import styles from './Onboarding.module.css'

const Overview = () => {
  const [currentStep, setCurrentStep] = useState(1) // Step tracking, starting at 1

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
        return <ChooseCategories nextStep={nextStep} prevStep={prevStep} />
      case 2:
        return <GradingFrequency nextStep={nextStep} prevStep={prevStep} />
      case 3:
        return <Baseline prevStep={prevStep} />
      default:
        return <ChooseCategories nextStep={nextStep} prevStep={prevStep} />
    }
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
