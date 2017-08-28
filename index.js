if (process.env.NODE_ENV === 'development') {
	require('dotenv').config()
}

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')

mongoose.Promise = Promise

mongoose.connect(
	process.env.MONGODB_URI,
	{
		useMongoClient: true
	},
	err => {
		if (err) throw err
	}
)

const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(bodyParser.json())

const index = require('./routes/index')
const users = require('./routes/users')

app.use(['/', '/v1'], index)
app.use('/v1/users', users)

app.use((req, res, next) => {
	let err = new Error()

	err.message = 'Not Found'
	err.status = 404

	next(err)
})

app.use((err, req, res, next) => res.status(err.status || 500).send(err))

module.exports = app
