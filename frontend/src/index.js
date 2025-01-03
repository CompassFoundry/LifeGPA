import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import AuthProvider from '@components/Auth/AuthState'
import posthog from 'posthog-js'

posthog.init('phc_z4J3egnUkpasUcfgQea8gQaHQPiPG1YVta537i7bJL1', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
})

// Render the React app
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
