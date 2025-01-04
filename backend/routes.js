const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

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

module.exports = router
