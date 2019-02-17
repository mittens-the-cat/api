const fetch = require('node-fetch')
const moment = require('moment')

class GitHub {
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
