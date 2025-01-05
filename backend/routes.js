const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

router.get('/', (req, res) => {
  res.send('Welcome to the Life GPA API')
})

// Middleware to check if the user is a "super admin"
const adminAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  console.log('Authenticated user:', req.user)

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET)
    console.log('Decoded Token:', decoded)

    const { data: user, error } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', decoded.sub)
      .single()

    if (error || !user) {
      throw new Error('Failed to fetch user role')
    }

    if (user.role !== 'super admin') {
      return res.status(403).json({ error: 'Access denied' })
    }

    req.user = { ...decoded, role: user.role }
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ error: 'Access token expired. Please refresh the token.' })
    }

    console.error('Error in admin middleware:', error.message)
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// Route to send email confirmation
router.post('/auth/send-confirmation-email', async (req, res) => {
  const { user_id, email } = req.body

  try {
    console.log('Sending confirmation email for user:', user_id)

    // Generate a unique confirmation token
    const token = uuidv4()
    const expiration = new Date()
    expiration.setHours(expiration.getHours() + 24) // Token valid for 24 hours

    console.log('Generated token:', token)
    console.log('Token expiration:', expiration)

    // Update the user_profiles table with the token and expiration
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        email_confirmation_token: token,
        token_expiration: expiration,
      })
      .eq('user_id', user_id)

    if (updateError) {
      console.error('Failed to update token in user_profiles:', updateError)
      throw new Error('Failed to store email confirmation token.')
    }

    console.log('Token successfully stored in user_profiles.')

    // Prepare the confirmation link
    const confirmationLink = `https://lifegpa.org/auth/confirm-email?token=${token}`
    console.log('Generated confirmation link:', confirmationLink)

    // Send the confirmation email using Brevo API
    const emailPayload = {
      templateId: 1, // Replace with your actual Brevo template ID
      to: [{ email }],
      params: {
        confirmation_link: confirmationLink, // Pass variables for your template placeholders
      },
    }

    console.log('Email payload:', emailPayload)

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify(emailPayload),
    })

    const emailResult = await emailResponse.json()
    console.log('Brevo API response:', emailResult)

    if (!emailResponse.ok) {
      console.error('Failed to send email via Brevo:', emailResult)
      throw new Error('Failed to send email confirmation.')
    }

    res.status(200).json({ message: 'Confirmation email sent successfully!' })
  } catch (error) {
    console.error('Error sending confirmation email:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Route to confirm email
router.get('/auth/confirm-email', async (req, res) => {
  const { token } = req.query

  console.log('Received token for email confirmation:', token)

  if (!token) {
    console.error('No token provided.')
    return res.status(400).json({ error: 'Token is required.' })
  }

  try {
    // Check if the token exists and is valid
    const { data: user, error } = await supabase
      .from('user_profiles')
      .select('user_id, token_expiration')
      .eq('email_confirmation_token', token)
      .single()

    if (error || !user) {
      console.error('Invalid token or user not found:', error)
      return res.status(400).json({ error: 'Invalid or expired token.' })
    }

    if (new Date() > new Date(user.token_expiration)) {
      console.error('Token has expired for user:', user.user_id)
      return res.status(400).json({ error: 'Token has expired.' })
    }

    // Mark the email as confirmed
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        is_email_confirmed: true,
        email_confirmation_token: null,
        token_expiration: null,
      })
      .eq('user_id', user.user_id)

    if (updateError) {
      console.error('Error updating user profile:', updateError)
      throw new Error('Failed to confirm email.')
    }

    console.log('Email confirmed for user:', user.user_id)
    res.status(200).json({ message: 'Email confirmed successfully!' })
  } catch (error) {
    console.error('Error confirming email:', error.message)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
