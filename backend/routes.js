const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Route to handle email confirmation
router.get('/auth/confirm-email', async (req, res) => {
  const { token } = req.query

  if (!token) {
    return res.status(400).json({ error: 'Token is required.' })
  }

  try {
    // Fetch user with matching token
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

    // Debugging: Log the user and token information
    console.log('Confirming email for user:', {
      user_id: user.user_id,
      email_confirmation_token: user.email_confirmation_token,
      token_expiration: user.token_expiration,
    })

    // Update email confirmation status
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
    // Fetch user profile to get current token and expiration
    const { data: userProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('email_confirmation_token, token_expiration')
      .eq('user_id', user_id)
      .single()

    if (fetchError || !userProfile) {
      console.error(
        'Error fetching user profile:',
        fetchError || 'User not found'
      )
      throw new Error('Failed to fetch user profile.')
    }

    let { email_confirmation_token, token_expiration } = userProfile

    // Check if token has expired or is invalid
    const isTokenExpired =
      !token_expiration || new Date() > new Date(token_expiration)

    if (isTokenExpired) {
      console.log('Token expired or invalid. Generating a new one...')
      email_confirmation_token = uuidv4() // Generate a new token
      token_expiration = new Date()
      token_expiration.setHours(token_expiration.getHours() + 24) // Set expiration to 24 hours from now

      // Update the database with the new token and expiration
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          email_confirmation_token,
          token_expiration: token_expiration.toISOString(),
        })
        .eq('user_id', user_id)

      if (updateError) {
        console.error('Error updating token in database:', updateError)
        throw new Error('Failed to update token in database.')
      }

      console.log('New token and expiration saved to the database.')
    }

    // Send the email
    const confirmationLink = `https://lifegpa.org/auth/confirm-email?token=${email_confirmation_token}`
    const emailPayload = {
      templateId: 1, // Replace with your Brevo template ID
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
      console.error('Error sending email:', errorMessage)
      throw new Error('Failed to send confirmation email.')
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

  // Validate input fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  try {
    // Save the contact submission to a Supabase table
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([{ name, email, message }])

    if (error) {
      console.error('Error saving contact submission:', error.message)
      throw error
    }

    console.log('Contact submission saved:', data)

    // Send notification email using Brevo
    const emailPayload = {
      sender: { name: 'Life GPA', email: process.env.BREVO_SENDER_EMAIL }, // Sender's email
      to: [{ email: process.env.ADMIN_EMAIL }], // Admin email
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
        'api-key': process.env.BREVO_API_KEY, // Brevo API key from environment variables
      },
      body: JSON.stringify(emailPayload),
    })

    if (!emailResponse.ok) {
      const errorMessage = await emailResponse.text()
      console.error('Error sending email:', errorMessage)
      throw new Error('Failed to send notification email.')
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

module.exports = router
