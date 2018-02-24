const { get } = require('lodash')

const User = require('../models/user')

const error = require('./error')

module.exports = async (request, reply) => {
  const token = get(request, 'headers.authorization')

  if (!token) {
    throw error('Token missing', 400)
  }

  const user = await User.findOne()
    .where('authToken')
    .eq(token)

  if (!user) {
    throw error('User not found', 401)
  }

  request.user = user
}
