const moment = require('moment')

const fetch = require('./fetch')
const firebase = require('./firebase')

class Notifications {
  constructor() {
    this.pool = []
    this.users = {}
    this.jobs = {}
  }

  async start(users) {
    for (const user of users) {
      if (this.pool.includes(user.id)) {
        return
      }

      this.pool.push(user.id)
      this.users[user.id] = user

      this.fetch(user)
    }
  }

  async add(user) {
    if (this.pool.includes(user.id)) {
      return
    }

    this.pool.push(user.id)
    this.users[user.id] = user

    this.fetch(user)
  }

  async update(user) {
    if (this.pool.includes(user.id)) {
      this.users[user.id] = user
    }
  }

  async remove(user) {
    if (this.pool.includes(user.id)) {
      const index = this.pool.findIndex(id => id === user.id)

      this.pool.splice(index, 1)
      delete this.users[user.id]

      clearTimeout(this.jobs[user.id])
    }
  }

  async fetch(user) {
    const { id, push, deviceToken, githubToken } = user

    if (push && githubToken) {
      try {
        let notified = false

        const notifications = await this.request('notifications', githubToken)

        for (const notification of notifications) {
          const { subject, repository, updated_at } = notification

          const updatedAt = moment(updated_at)

          if (updatedAt.isAfter(user.lastNotified)) {
            const { title } = subject
            const { full_name } = repository

            await firebase.push({
              notification: {
                title: full_name,
                body: title
              },
              to: deviceToken
            })

            notified = true
          }
        }

        if (notified) {
          user.lastNotified = Date.now()

          await user.save()
        }

        const { limit, remaining, reset, interval } = notifications.limit

        if (remaining > 0) {
          this.schedule(user, interval * 1000)
        } else {
          const next = moment().format('X') - interval * 1000

          if (next > 0) {
            this.schedule(user, next)
          } else {
            this.schedule(user, interval * 1000)
          }
        }
      } catch (err) {}
    }
  }

  schedule(user, interval) {
    this.jobs[user.id] = setTimeout(() => this.fetch(user), interval)
  }

  request(url, token) {
    const headers = {
      authorization: `token ${token}`
    }

    return fetch(`https://api.github.com/${url}`, 'GET', undefined, headers)
  }
}

module.exports = new Notifications()
