const { MONGODB_URI, NODE_ENV, PORT } = process.env

const cors = require('cors')()
const fastify = require('fastify')({
  logger: NODE_ENV === 'dev'
})
const mongoose = require('mongoose')

mongoose.connect(MONGODB_URI)
mongoose.Promise = global.Promise

fastify.use(cors)

const { home, users } = require('./routes')

fastify.register(home)
fastify.register(users)

fastify.listen(PORT, '0.0.0.0', err => {
  if (err) {
    throw err
  }

  console.log(`server listening on ${fastify.server.address().port}`)
})

module.exports = fastify
