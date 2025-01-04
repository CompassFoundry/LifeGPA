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
    // Verify the JWT
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET)
    console.log('Decoded Token:', decoded)

    // Fetch the user's role from the database
    const { data: user, error } = await supabase
      .from('users')
      .select('role') // Select only the role column
      .eq('user_id', decoded.sub) // Match the sub claim (user_id) from the token
      .single()

    if (error || !user) {
      throw new Error('Failed to fetch user role')
    }

    // Check if the user is a super admin
    if (user.role !== 'super admin') {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Attach the user's role to the request object for downstream use
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

// Login Route (Includes token and role in response)
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const { data: session, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (authError) throw authError

    // Fetch the user's role
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_id, role')
      .eq('email', email)
      .single()

    if (userError || !user) throw new Error('User not found')

    // Extract tokens from session.session
    const access_token = session.session.access_token // Access token
    const refresh_token = session.session.refresh_token // Refresh token

    // Respond with tokens and role
    res.status(200).json({
      message: 'Login successful',
      access_token, // Send the access token explicitly
      refresh_token, // Optional: send the refresh token
      role: user.role, // User's role
    })
  } catch (error) {
    console.error('Error during login:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Route to fetch user-specific data (default for "user" role)
router.get('/user/data', async (req, res) => {
  const authHeader = req.headers.authorization // Expecting 'Bearer <token>'

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET)

    // Fetch user-specific data using decoded user ID
    const { data: userData, error } = await supabase
      .from('user_data') // Replace with your table name for user-specific data
      .select('*')
      .eq('user_id', decoded.id)

    if (error) throw error

    res.status(200).json(userData)
  } catch (error) {
    console.error('Error fetching user data:', error)
    res.status(500).json({ error: error.message })
  }
})

// Route to fetch all users (accessible only by "super admin")
router.get('/admin/users', adminAuthMiddleware, async (req, res) => {
  try {
    // Fetch all users from the database
    const { data: users, error } = await supabase.from('users').select('*')
    if (error) throw error

    res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Route to refresh access tokens
router.post('/auth/refresh', async (req, res) => {
  const { refresh_token } = req.body

  if (!refresh_token) {
    return res.status(400).json({ error: 'Refresh token is required' })
  }

  try {
    // Use the refresh token to get a new session
    const { data: session, error } = await supabase.auth.refreshSession({
      refresh_token,
    })

    if (error) {
      throw new Error('Failed to refresh session: ' + error.message)
    }

    // Extract new access token and refresh token
    const newAccessToken = session.session.access_token
    const newRefreshToken = session.session.refresh_token

    res.status(200).json({
      message: 'Token refreshed successfully',
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    })
  } catch (error) {
    console.error('Error refreshing token:', error.message)
    res.status(500).json({ error: 'Failed to refresh token' })
  }
})

// Route to send email confirmation
router.post('/auth/send-confirmation-email', async (req, res) => {
  const { user_id, email } = req.body

  try {
    // Generate a unique confirmation token
    const token = uuidv4()
    const expiration = new Date()
    expiration.setHours(expiration.getHours() + 24) // Token valid for 24 hours

    // Update the user_profiles table with the token and expiration
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        email_confirmation_token: token,
        token_expiration: expiration,
      })
      .eq('user_id', user_id)

    if (updateError)
      throw new Error('Failed to store email confirmation token.')

    // Prepare the confirmation link
    const confirmationLink = `https://lifegpa.org/confirm-email?token=${token}`

    // Send the confirmation email using your Brevo template
    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY, // Your Brevo API key from .env
      },
      body: JSON.stringify({
        templateId: 1, // Replace with your actual Brevo template ID
        to: [{ email }],
        params: {
          confirmation_link: confirmationLink, // Pass variables for your template placeholders
        },
      }),
    })

    if (!emailResponse.ok) {
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

    // Check if the token has expired
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

    // Respond with success
    res.status(200).json({ message: 'Email confirmed successfully!' })
  } catch (error) {
    console.error('Error confirming email:', error.message)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
