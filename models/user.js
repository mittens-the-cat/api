const mongoose = require('mongoose')
const fetch = require('node-fetch')

const error = require('../lib/error')
const notifications = require('../lib/notifications')

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
  lastNotified: {
    type: Date,
    default: new Date(1970)
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
  get push() {
    return Boolean(this.notifications) && this.deviceToken
  }

  toggleNotifications(deviceToken) {
    this.notifications = !!deviceToken
    this.deviceToken = deviceToken || null

    if (this.notifications) {
      notifications.update(this)
    } else {
      notifications.remove(this)
    }

    return this.save()
  }

  static async verify(githubToken) {
    const response = await fetch(
      `https://api.github.com/user?access_token=${githubToken}`
    )

    const json = await response.json()

    if (response.status === 200) {
      const { id } = json

      const user = await this.findOne()
        .where('_id')
        .eq(id)

      if (user) {
        return user
      }

      return json
    } else {
      throw error(json.message)
    }
  }
}

schema.loadClass(User)

module.exports = mongoose.model('User', schema)
