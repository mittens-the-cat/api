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

    const { id } = await User.verify(githubToken)

    const authToken = await token.generate(githubToken + Date.now())

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
