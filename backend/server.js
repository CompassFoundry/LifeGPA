require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path') // Import path module for serving static files
const app = express()
const routes = require('./routes')
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
app.use('/', routes)

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
