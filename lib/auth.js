const { get } = require('lodash')

const { User } = require('../models')

const error = require('./error')

module.exports = async (request, reply) => {
  const token = get(request, 'headers.auth')

  if (!token) {
    throw error('Token missing', 400)
  }

  const user = await User.findOne()
    .where('token')
    .eq(token)

  if (!user) {
    throw error('User not found', 401)
  }

  request.user = user
}
