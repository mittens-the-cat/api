const { get } = require('lodash')

const { error, token } = require('../lib')
const { User } = require('../models')
const { user } = require('../schemas')

const createUser = {
  method: 'POST',
  schema: user,
  url: '/users',
  async handler(request) {
    const { deviceToken, githubToken } = get(request, 'body.user')

    const exists = await User.verify(githubToken)

    const { _id } = exists

    if (_id) {
      return {
        user: exists
      }
    }

    const authToken = await token.generate(githubToken + Date.now())
    const { id } = exists

    const user = new User({
      authToken,
      deviceToken,
      githubToken,
      _id: id
    })

    if (!deviceToken) {
      user.notifications = false
    }

    await user.save()

    return {
      user
    }
  }
}

module.exports = (fastify, opts, next) => {
  fastify.route(createUser)

  next()
}
