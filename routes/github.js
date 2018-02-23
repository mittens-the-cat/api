const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env

const index = {
  method: 'GET',
  url: '/github',
  async handler() {
    return {
      id: GITHUB_CLIENT_ID,
      secret: GITHUB_CLIENT_SECRET,
      scope: 'notifications',
      base: 'https://github.com/login/oauth',
      redirect: 'github://oauth'
    }
  }
}

module.exports = (fastify, opts, next) => {
  fastify.route(index)

  next()
}
