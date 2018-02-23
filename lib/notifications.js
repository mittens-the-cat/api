const { DELAY } = process.env

const { User } = require('../models')

const fetch = require('./fetch')
const firebase = require('./firebase')

class Notifications {
  async start() {
    const users = await User.find().select(
      'notifications githubToken deviceToken'
    )

    for (const user of users) {
      await this.fetch(user)
    }

    return true
  }

  async fetch(user) {
    const { _id, push, githubToken } = user

    if (push && githubToken) {
      try {
        const notifications = await this.request('notifications', githubToken)

        for (const notification of notifications) {
          const { subject, repository } = notification
          const { title } = subject
          const { full_name } = repository

          await firebase.push({
            notification: {
              title: full_name,
              body: title
            },
            token: deviceToken
          })
        }
      } catch (err) {
        const { message } = err

        console.error('fetch', _id, 'notifications', message)
      }
    }
  }

  request(url, token) {
    const headers = {
      authorization: `token ${token}`
    }

    return fetch(`https://api.github.com/${url}`, 'GET', undefined, headers)
  }
}
