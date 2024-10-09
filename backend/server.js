const express = require('express')
const cors = require('cors')
const app = express()
const routes = require('./routes')
const port = process.env.PORT || 5001

// Enable CORS to allow cross-origin requests from React
app.use(cors())

// Use the routes defined in routes.js
app.use('/', routes)

// Sample route
app.get('/', (req, res) => {
  res.send('Hello from Render!')
})

// Ensure the app listens on all network interfaces (0.0.0.0)
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`)
})
