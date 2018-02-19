const index = {
  method: 'GET',
  url: '/',
  handler(request, reply) {
    reply.redirect('https://designplox.com/github/')
  }
}

module.exports = (fastify, opts, next) => {
  fastify.route(index)

  next()
}
