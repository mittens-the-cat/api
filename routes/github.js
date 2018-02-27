const {
  GITHUB_CLIENT_ID_ANDROID,
  GITHUB_CLIENT_SECRET_ANDROID,
  GITHUB_CLIENT_ID_IOS,
  GITHUB_CLIENT_SECRET_IOS
} = process.env

const index = {
  method: 'GET',
  url: '/github',
  async handler() {
    return {
      android: {
        id: GITHUB_CLIENT_ID_ANDROID,
        secret: GITHUB_CLIENT_SECRET_ANDROID,
        redirect: 'http://localhost/github'
      },
      ios: {
        id: GITHUB_CLIENT_ID_IOS,
        secret: GITHUB_CLIENT_SECRET_IOS,
        redirect: 'github://oauth'
      },
      scope: 'notifications',
      base: 'https://github.com/login/oauth'
    }
  }
}

module.exports = (fastify, opts, next) => {
  fastify.route(index)

  next()
}
