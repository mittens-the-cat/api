const { MONGODB_URI, NODE_ENV, PORT } = process.env

const cors = require('cors')()
const fastify = require('fastify')({
  logger: NODE_ENV === 'dev'
})
const mongoose = require('mongoose')

mongoose.connect(MONGODB_URI)
mongoose.Promise = global.Promise

fastify.use(cors)

const index = require('./routes')

fastify.register(index)

fastify.listen(PORT, '0.0.0.0', err => {
  if (err) {
    throw err
  }

  console.log(`server listening on ${fastify.server.address().port}`)
})

module.exports = fastify
