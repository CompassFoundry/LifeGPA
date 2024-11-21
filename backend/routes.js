const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Route to fetch data (example: users)
router.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*')
    if (error) throw error

    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: error.message })
  }
})

// Route to add a new user
router.post('/users', async (req, res) => {
  const { name, email } = req.body // Expecting name and email in request body

  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email }]) // Insert a new user
    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    console.error('Error adding user:', error)
    res.status(500).json({ error: error.message })
  }
})

// Route for authentication (optional example)
router.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body

  try {
    const { user, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error

    res.status(201).json({ message: 'User created', user })
  } catch (error) {
    console.error('Error during signup:', error)
    res.status(500).json({ error: error.message })
  }
})

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const { session, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error

    res.status(200).json({ message: 'Login successful', session })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
