const functions = require('firebase-functions')
const fetch = require('node-fetch')
const moment = require('moment')

class GitHub {
  async auth(code) {
    const {
      github: { id, secret }
    } = functions.config()

    const response = await fetch(
      `https://github.com/login/oauth/access_token?client_id=${id}&client_secret=${secret}&code=${code}`,
      {
        headers: {
          accept: 'application/json'
        }
      }
    )

    return response.json()
  }

  async fetch(token, lastUpdated = moment('2008-02-08')) {
    const response = await fetch('https://api.github.com/notifications', {
      headers: {
        authorization: `token ${token}`,
        'user-agent': 'Mittens'
      }
    })

    const data = await response.json()

    const { status } = response

    if (status !== 200) {
      const { message } = data

      throw new Error(message)
    }

    return data
      .map(
        ({
          updated_at,
          subject: { title, type, url },
          repository: { full_name }
        }) => ({
          type,
          url,
          body: title,
          repository: full_name,
          updated: moment(updated_at)
        })
      )
      .filter(({ updated }) => updated.isAfter(lastUpdated))
  }
}

module.exports = new GitHub()
