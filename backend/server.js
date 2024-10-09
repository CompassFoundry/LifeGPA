const express = require('express')
const cors = require('cors')
const app = express()
const routes = require('./routes')
const port = 5001

// Enable CORS to allow cross-origin requests from React
app.use(cors())

// Use the routes defined in routes.js
app.use('/', routes)

// Start the server on port 5001
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
