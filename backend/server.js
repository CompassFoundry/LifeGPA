const express = require('express')
const cors = require('cors')
const app = express()
const routes = require('./routes')
const port = process.env.PORT || 5001

// Enable CORS to allow cross-origin requests from React
app.use(cors())

// Use the routes defined in routes.js
app.use('/', routes)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
