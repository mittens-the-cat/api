const mongoose = require('mongoose')
const fetch = require('node-fetch')

const { error } = require('../lib')

const schema = new mongoose.Schema({
  _id: {
    type: Number
  },
  notifications: {
    default: true,
    type: Boolean
  },
  githubToken: {
    type: String
  },
  deviceToken: {
    type: String
  },
  authToken: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
})

schema.index(
  {
    authToken: 1
  },
  {
    name: 'authToken',
    unique: true
  }
)

class User {
  toggleNotifications(deviceToken) {
    this.deviceToken = deviceToken || null

    return this.save()
  }

  static async verify(githubToken) {
    const response = await fetch(
      `https://api.github.com/user?access_token=${githubToken}`
    )

    const json = await response.json()

    if (response.status === 200) {
      return json
    } else {
      throw error(json.message)
    }
  }
}

schema.loadClass(User)

module.exports = mongoose.model('User', schema)
