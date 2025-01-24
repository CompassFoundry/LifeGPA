require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path') // Import path module for serving static files
const cron = require('node-cron')
const { router, sendReminderEmails, logEmail } = require('./routes') // Import router and sendReminderEmails
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const app = express()
const port = process.env.PORT || 5001

// Enable CORS with specific origin(s)
const corsOptions = {
  origin: [
    'https://lifegpa.org',
    'http://localhost:3000',
    'http://localhost:3001',
  ], // Add frontend's URL here
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  credentials: true, // Allow cookies or authentication headers
}
app.use(cors(corsOptions))

// Add middleware to parse JSON bodies
app.use(express.json())

// Use the routes defined in routes.js
app.use('/', router)

// Sample route (optional)
app.get('/api/health', (req, res) => {
  res.send('API is healthy!')
})

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend', 'build')))

// Fallback route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
})

// Ensure the app listens on all network interfaces (0.0.0.0)
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`)
})

// Cron Jobs

// Schedule Weekly Emails (Every Sunday at 9 AM)
cron.schedule('0 9 * * 0', async () => {
  try {
    console.log('Sending weekly reminders...')
    await sendReminderEmails('weekly')
  } catch (error) {
    console.error('Error sending weekly reminders:', error.message)
  }
})

// Schedule Monthly Emails (Last Day of the Month at 9 AM)
cron.schedule('0 9 28-31 * *', async () => {
  const today = new Date()
  const lastDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate()
  if (today.getDate() === lastDayOfMonth) {
    try {
      console.log('Sending monthly reminders...')
      await sendReminderEmails('monthly')
    } catch (error) {
      console.error('Error sending monthly reminders:', error.message)
    }
  } else {
    console.log('Skipping monthly reminders. Not the last day of the month.')
  }
})

// Schedule Quarterly Emails (Last Day of the Quarter at 9 AM)
cron.schedule('0 9 28-31 3,6,9,12 *', async () => {
  const today = new Date()
  const lastDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate()
  if (today.getDate() === lastDayOfMonth) {
    try {
      console.log('Sending quarterly reminders...')
      await sendReminderEmails('quarterly')
    } catch (error) {
      console.error('Error sending quarterly reminders:', error.message)
    }
  } else {
    console.log(
      'Skipping quarterly reminders. Not the last day of the quarter.'
    )
  }
})

// Test Logic for Weekly Reminders (Manual Test)
// ;(async () => {
//   try {
//     console.log('Manually running test logic for Weekly reminders...')
//     const { data: users, error } = await supabase
//       .from('gpa_grading_frequency')
//       .select('user_id, frequency, email') // Pull email directly
//       .eq('frequency', 'weekly')
//       .eq('email', 'testuser8@nickgmail.com') // Filter by email

//     if (error) {
//       throw new Error(`Failed to fetch users for test email: ${error.message}`)
//     }

//     if (!users || users.length === 0) {
//       console.log('No users found for the test email.')
//       return
//     }

//     console.log(`Found ${users.length} users for weekly reminders.`)

//     for (const user of users) {
//       const { user_id, email } = user // Access email directly from the user object

//       if (!email) {
//         console.warn(`No email found for user_id: ${user_id}`)
//         continue
//       }

//       console.log(`Sending test Weekly reminder to: ${email}`)

//       // Log the email as "pending"
//       await logEmail(
//         user_id,
//         email,
//         2,
//         { login_link: 'https://lifegpa.org/login' },
//         'weekly',
//         'pending'
//       )

//       // Send the email
//       const emailPayload = {
//         templateId: 2, // Brevo template ID
//         to: [{ email }],
//         params: {
//           login_link: 'https://lifegpa.org/login',
//         },
//       }

//       const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'api-key': process.env.BREVO_API_KEY,
//         },
//         body: JSON.stringify(emailPayload),
//       })

//       if (emailResponse.ok) {
//         console.log(`Email delivered to ${email}`)
//         await logEmail(
//           user_id,
//           email,
//           2,
//           { login_link: 'https://lifegpa.org/login' },
//           'weekly',
//           'delivered'
//         )
//       } else {
//         const errorMessage = await emailResponse.text()
//         console.error(`Email failed for ${email}: ${errorMessage}`)
//         await logEmail(
//           user_id,
//           email,
//           2,
//           { login_link: 'https://lifegpa.org/login' },
//           'weekly',
//           'failed',
//           errorMessage
//         )
//       }
//     }
//   } catch (error) {
//     console.error('Error running test logic:', error.message)
//   }
// })()
