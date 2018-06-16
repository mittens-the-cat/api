const { get } = require('lodash')

const auth = require('../lib/auth')
const error = require('../lib/error')
const notifications = require('../lib/notifications')
const token = require('../lib/token')

const User = require('../models/user')

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
      exists.githubToken = githubToken

      await exists.update({
        deviceToken,
        notifications: true
      })

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

    await notifications.add(user)

    return {
      user
    }
  }
}

const deleteUser = {
  method: 'DELETE',
  url: '/users/me',
  beforeHandler: auth,
  async handler(request) {
    const { user } = request

    await user.update({
      badge: false,
      deviceToken: null,
      notifications: false
    })

    await notifications.remove(user)

    return {
      message: 'Logged out successfully'
    }
  }
}

const updateUser = {
  method: 'PUT',
  schema: user,
  url: '/users/me',
  beforeHandler: auth,
  async handler(request) {
    const { user } = request

    const data = get(request, 'body.user')

    await user.update(data)

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
  fastify.route(deleteUser)
  fastify.route(updateUser)
  fastify.route(getMe)

  next()
}
