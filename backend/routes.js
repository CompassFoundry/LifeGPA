const express = require('express')
const { Pool } = require('pg')
const router = express.Router()

// PostgreSQL connection setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'life_gpa_db',
  password: 'Postgres12!',
  port: 5432,
})

module.exports = router
