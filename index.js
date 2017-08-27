if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')

const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(bodyParser.json())

const index = require('./routes/index')

app.use('/', index)

app.use((req, res, next) => {
  let err = new Error()

  err.message = 'Not Found'
  err.status = 404

  next(err)
})

app.use((err, req, res, next) => res.status(err.status || 500).send(err))

module.exports = app
