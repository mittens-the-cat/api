const { FCM_PROJECT_ID, FCM_SERVER_KEY } = process.env

const fetch = require('./fetch')

class Firebase {
  async push(message) {
    try {
      const response = await this.send(message)

      console.log('push', message)
    } catch (err) {
      console.error('push', err)
    }
  }

  send(body) {
    const headers = {
      authorization: `key=${FCM_SERVER_KEY}`,
      'content-type': 'application/json'
    }

    return fetch('https://fcm.googleapis.com/fcm/send', 'POST', body, headers)
  }
}

module.exports = new Firebase()
