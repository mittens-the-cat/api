const { FIREBASE_ADMIN_KEY_PATH } = process.env

const admin = require('firebase-admin')

const fetch = require('./fetch')

class Firebase {
  async init() {
    const serviceAccount = await fetch(FIREBASE_ADMIN_KEY_PATH)

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  }

  async push(message) {
    try {
      const response = await admin.messaging().send(message)

      console.log('push', response)
    } catch (err) {
      console.error('push', err)
    }
  }

  request(url, token) {
    const headers = {
      authorization: `token ${token}`
    }

    return fetch(`https://api.github.com/${url}`, 'GET', undefined, headers)
  }
}

module.exports = new Firebase()
