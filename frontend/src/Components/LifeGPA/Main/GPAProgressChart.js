import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const GPAProgressChart = ({ gpaHistory }) => {
  const chartData = {
    labels: gpaHistory.map((entry) => entry.date),
    datasets: [
      {
        label: 'Overall Life GPA',
        data: gpaHistory.map((entry) => entry.gpa),
        fill: false,
        borderColor: '#00bfa6', // Line color
        tension: 0.1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: '#ffffff', // White text for better visibility on dark background
        },
        grid: {
          color: '#444444', // Dark grey grid lines to blend with dark background
        },
      },
      y: {
        ticks: {
          color: '#ffffff', // White text for better visibility on dark background
        },
        grid: {
          color: '#444444', // Dark grey grid lines to blend with dark background
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff', // White legend text
        },
      },
      tooltip: {
        backgroundColor: '#333333', // Dark background for tooltip
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#444444',
        borderWidth: 1,
      },
    },
  }

  const chartContainerStyle = {
    backgroundColor: '#141430', // Dark background color for the chart container
    padding: '100px',
    borderRadius: '10px',
  }

  return (
    <div style={chartContainerStyle}>
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}

export default GPAProgressChart
