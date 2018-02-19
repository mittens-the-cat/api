const { get } = require('lodash')

const { error } = require('.')
const { User } = require('../models')

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
