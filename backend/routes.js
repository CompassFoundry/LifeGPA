const express = require('express')
const { Pool } = require('pg')
require('dotenv').config()
const router = express.Router()

// PostgreSQL connection setup
const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
})

module.exports = router
