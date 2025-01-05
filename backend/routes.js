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
    // Fetch the token and expiration directly from user_profiles
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select('email_confirmation_token, token_expiration')
      .eq('user_id', user_id)
      .single()

    if (error || !userProfile) {
      throw new Error('Failed to fetch user profile or token.')
    }

    const { email_confirmation_token, token_expiration } = userProfile

    // Ensure token is valid
    if (new Date() > new Date(token_expiration)) {
      throw new Error('Token has expired.')
    }

    // Send the email
    const confirmationLink = `https://lifegpa.org/auth/confirm-email?token=${email_confirmation_token}`
    const emailPayload = {
      templateId: 1, // Replace with Brevo template ID
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
      throw new Error('Failed to send confirmation email.')
    }

    res.status(200).json({ message: 'Confirmation email sent successfully!' })
  } catch (error) {
    console.error('Error sending confirmation email:', error.message)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
