const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Middleware to check if the user is a "super admin"
const adminAuthMiddleware = async (req, res, next) => {
  const { userId } = req.headers // Expecting user ID in request headers

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' })
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (error || !user) {
      throw new Error('User not found')
    }

    if (user.role !== 'super admin') {
      return res.status(403).json({ error: 'Access denied' })
    }

    next()
  } catch (error) {
    console.error('Error in admin middleware:', error.message)
    res.status(500).json({ error: error.message })
  }
}

// Route to fetch all users (accessible only by "super admin")
router.get('/admin/users', adminAuthMiddleware, async (req, res) => {
  try {
    const { data: users, error } = await supabase.from('users').select('*')
    if (error) throw error

    res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: error.message })
  }
})

// Login Route (Includes role in response)
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const { session, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (authError) throw authError

    // Fetch the user's role
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', email)
      .single()

    if (userError || !user) throw new Error('User not found')

    res
      .status(200)
      .json({ message: 'Login successful', session, role: user.role })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ error: error.message })
  }
})

// Route to fetch user-specific data (default for "user" role)
router.get('/user/data', async (req, res) => {
  const { userId } = req.headers // Expecting user ID in request headers

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' })
  }

  try {
    const { data: userData, error } = await supabase
      .from('user_data') // Replace with your table name for user-specific data
      .select('*')
      .eq('user_id', userId)

    if (error) throw error

    res.status(200).json(userData)
  } catch (error) {
    console.error('Error fetching user data:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
