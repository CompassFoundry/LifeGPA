import React, { useState, useEffect } from 'react'
import styles from './WageWatch.module.css'

function WageWatch() {
  const [annualIncome, setAnnualIncome] = useState('')
  const [hoursPerWeek, setHoursPerWeek] = useState(40)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)

  // Function to parse input values with commas
  const parseIncomeInput = (value) => {
    const cleanedValue = value.replace(/,/g, '')
    return cleanedValue === '' ? '' : parseFloat(cleanedValue) || 0
  }

  // Calculate derived income metrics
  const hourlyIncome =
    annualIncome && hoursPerWeek
      ? (annualIncome / (hoursPerWeek * 52)).toFixed(2)
      : 0
  const perHour365 = annualIncome ? (annualIncome / 8760).toFixed(2) : 0
  const perMinute = annualIncome ? (annualIncome / (8760 * 60)).toFixed(4) : 0
  const perSecond = annualIncome ? (annualIncome / (8760 * 3600)).toFixed(6) : 0

  // Handler for starting/stopping the timer
  useEffect(() => {
    let timer
    if (isTimerRunning) {
      timer = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1)
      }, 1000)
    } else {
      clearInterval(timer)
    }
    return () => clearInterval(timer)
  }, [isTimerRunning])

  // Calculating real-time earnings
  const earningsPerSecond = annualIncome ? parseFloat(perMinute) / 60 : 0
  const currentEarnings = (elapsedTime * earningsPerSecond).toFixed(2)

  // Handler for resetting the timer and earnings
  const resetTimer = () => {
    setIsTimerRunning(false)
    setElapsedTime(0)
  }

  return (
    <div className={styles.wageWatchContainer}>
      <h1 style={{ textAlign: 'center' }}>Wage Watch</h1>
      <div className={styles.inputContainer}>
        <label>Annual Salary/Income ($):</label>
        <input
          type='text'
          value={annualIncome.toLocaleString('en-US')}
          onChange={(e) => setAnnualIncome(parseIncomeInput(e.target.value))}
        />
        <label>Hours per week worked:</label>
        <input
          type='number'
          value={hoursPerWeek}
          onChange={(e) => setHoursPerWeek(parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className={styles.metricsContainer}>
        <h2>Income Metrics</h2>
        <div className={styles.metricsRow}>
          <p>Hourly Income (for hours worked):</p>
          <p className={styles.metricsResults}>${hourlyIncome}</p>
        </div>
        <div className={styles.metricsRow}>
          <p>Hourly Income (over full year):</p>
          <p className={styles.metricsResults}>${perHour365}</p>
        </div>
        <div className={styles.metricsRow}>
          <p>Per Minute Income:</p>
          <p className={styles.metricsResults}>${perMinute}</p>
        </div>
        <div className={styles.metricsRow}>
          <p>Per Second Income:</p>
          <p className={styles.metricsResults}>${perSecond}</p>
        </div>
      </div>
      <div className={styles.earnedIncomeContainer}>
        <h2>Real-Time Earnings Tracker</h2>

        <div className={styles.earnedIncomeDisplay}>
          <p style={{ fontSize: '2.5rem' }}>${currentEarnings}</p>
        </div>
        {(isTimerRunning || elapsedTime > 0) && (
          <div className={styles.elapsedTimeDisplay}>
            <p>Elapsed Time: {elapsedTime} seconds</p>
          </div>
        )}
        <button
          className={styles.primaryButton}
          onClick={() => setIsTimerRunning(!isTimerRunning)}
        >
          {isTimerRunning ? 'Pause' : elapsedTime > 0 ? 'Resume' : 'Start'}
        </button>
        {elapsedTime > 0 && !isTimerRunning && (
          <button
            className={styles.secondaryButton}
            onClick={resetTimer}
            style={{ marginLeft: '10px' }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}

export default WageWatch
