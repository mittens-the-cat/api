const { TOKEN_SECRET } = process.env

const jwt = require('jsonwebtoken')

module.exports = {
  generate(data = Date.now()) {
    return jwt.sign(data, TOKEN_SECRET)
  },
  verify(token) {
    return jwt.verify(token, TOKEN_SECRET)
  }
}
