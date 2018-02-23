const { get } = require('lodash')

const { auth, error, token } = require('../lib')
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
      exists.authToken = await token.generate(githubToken + Date.now())

      await exists.save()

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

const getMe = {
  method: 'GET',
  schema: user,
  url: '/users/me',
  beforeHandler: auth,
  async handler(request) {
    const { user } = request

    return {
      user
    }
  }
}

module.exports = (fastify, opts, next) => {
  fastify.route(createUser)
  fastify.route(getMe)

  next()
}
