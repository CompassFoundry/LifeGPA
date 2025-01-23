const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { createClient } = require('@supabase/supabase-js')
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))
const { v4: uuidv4 } = require('uuid') // For generating tokens

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Utility function to log email activity
async function logEmail(
  userId,
  email,
  templateId,
  params,
  frequency,
  status,
  errorMessage = null
) {
  const { data, error } = await supabase.from('email_logs').insert([
    {
      user_id: userId,
      email,
      template_id: templateId,
      params,
      frequency,
      status,
      error_message: errorMessage,
      created_at: new Date().toISOString(),
    },
  ])

  if (error) {
    console.error('Failed to log email:', error.message)
  } else {
    console.log('Email logged successfully:', data)
  }
}

// Function to send reminder emails
async function sendReminderEmails(frequency) {
  try {
    const { data: users, error } = await supabase
      .from('gpa_grading_frequency')
      .select('user_id, frequency, email')
      .eq('frequency', 'monthly')
      .eq('email', 'testuser8@nickgmail.com')

    if (error) {
      throw new Error(
        `Failed to fetch users for frequency ${frequency}: ${error.message}`
      )
    }

    console.log(`Found ${users.length} users for ${frequency} reminders.`)

    for (const user of users) {
      const { user_id, users: userInfo } = user
      const email = userInfo?.email

      if (!email) {
        console.warn(`No email found for user_id: ${user_id}`)
        continue
      }

      // Log the email as "pending"
      await logEmail(
        user_id,
        email,
        2,
        { login_link: 'https://lifegpa.org/login' },
        frequency,
        'pending'
      )

      // Send the email
      const emailPayload = {
        templateId: 2, // Brevo template ID
        to: [{ email }],
        params: {
          login_link: 'https://lifegpa.org/login',
        },
      }

      const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify(emailPayload),
      })

      if (emailResponse.ok) {
        await logEmail(
          user_id,
          email,
          2,
          { login_link: 'https://lifegpa.org/login' },
          frequency,
          'delivered'
        )
      } else {
        const errorMessage = await emailResponse.text()
        await logEmail(
          user_id,
          email,
          2,
          { login_link: 'https://lifegpa.org/login' },
          frequency,
          'failed',
          errorMessage
        )
      }
    }
  } catch (error) {
    console.error(`Error sending ${frequency} reminders:`, error.message)
  }
}

// Route to handle email confirmation
router.get('/auth/confirm-email', async (req, res) => {
  const { token } = req.query

  if (!token) {
    return res.status(400).json({ error: 'Token is required.' })
  }

  try {
    const { data: user, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email_confirmation_token', token)
      .single()

    if (error || !user) {
      return res.status(400).json({ error: 'Invalid or expired token.' })
    }

    if (new Date() > new Date(user.token_expiration)) {
      return res.status(400).json({ error: 'Token has expired.' })
    }

    console.log('Confirming email for user:', {
      user_id: user.user_id,
      email_confirmation_token: user.email_confirmation_token,
      token_expiration: user.token_expiration,
    })

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        is_email_confirmed: true,
        email_confirmation_token: null,
        token_expiration: null,
      })
      .eq('user_id', user.user_id)

    if (updateError) {
      throw new Error('Failed to confirm email.')
    }

    res.status(200).json({ message: 'Email confirmed successfully!' })
  } catch (error) {
    console.error('Error confirming email:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Route to send confirmation email
router.post('/auth/send-confirmation-email', async (req, res) => {
  const { user_id, email } = req.body

  try {
    const { data: userProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('email_confirmation_token, token_expiration')
      .eq('user_id', user_id)
      .single()

    if (fetchError || !userProfile) {
      throw new Error('Failed to fetch user profile.')
    }

    let { email_confirmation_token, token_expiration } = userProfile
    const isTokenExpired =
      !token_expiration || new Date() > new Date(token_expiration)

    if (isTokenExpired) {
      email_confirmation_token = uuidv4()
      token_expiration = new Date()
      token_expiration.setHours(token_expiration.getHours() + 24)

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          email_confirmation_token,
          token_expiration: token_expiration.toISOString(),
        })
        .eq('user_id', user_id)

      if (updateError) {
        throw new Error('Failed to update token in database.')
      }
    }

    const confirmationLink = `https://lifegpa.org/auth/confirm-email?token=${email_confirmation_token}`
    const emailPayload = {
      templateId: 1,
      to: [{ email }],
      params: { confirmation_link: confirmationLink },
    }

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify(emailPayload),
    })

    if (!emailResponse.ok) {
      const errorMessage = await emailResponse.text()
      throw new Error('Failed to send confirmation email: ' + errorMessage)
    }

    res.status(200).json({ message: 'Verification email sent successfully!' })
  } catch (error) {
    console.error('Error in /auth/send-confirmation-email:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Route to handle contact form submissions
router.post('/contact/submit', async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([{ name, email, message }])

    if (error) {
      throw error
    }

    console.log('Contact submission saved:', data)

    const emailPayload = {
      sender: { name: 'Life GPA', email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: process.env.CONTACT_EMAIL }],
      subject: 'New Contact Form Submission',
      htmlContent: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    }

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify(emailPayload),
    })

    if (!emailResponse.ok) {
      const errorMessage = await emailResponse.text()
      throw new Error('Failed to send notification email: ' + errorMessage)
    }

    res
      .status(200)
      .json({ message: 'Your message has been submitted successfully!' })
  } catch (error) {
    console.error('Error in /contact/submit route:', error.message)
    res
      .status(500)
      .json({ error: 'Failed to save your message. Please try again.' })
  }
})

// Route for testing email reminders manually
router.get('/test-email-schedule', async (req, res) => {
  const { frequency } = req.query

  if (!frequency || !['Weekly', 'Monthly', 'Quarterly'].includes(frequency)) {
    return res.status(400).json({ error: 'Invalid or missing frequency.' })
  }

  try {
    await sendReminderEmails(frequency)
    res.status(200).json({ message: `Reminder emails sent for ${frequency}.` })
  } catch (error) {
    console.error(
      `Error in test-email-schedule for ${frequency}:`,
      error.message
    )
    res.status(500).json({ error: error.message })
  }
})

// Export the router to use in the server
module.exports = {
  router,
  sendReminderEmails,
}
