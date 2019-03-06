const functions = require('firebase-functions')

const moment = require('moment')

const db = require('./lib/db')
const github = require('./lib/github')
const messaging = require('./lib/messaging')

exports.auth = functions.https.onRequest(async (request, response) => {
  const {
    body: { code }
  } = request

  const data = await github.auth(code)

  response.send(data)
})

exports.fetch = functions.https.onRequest(async (request, response) => {
  const users = await db.getUsers()

  await Promise.all(
    users.map(async ({ github_token, push_token, updated, username }) => {
      try {
        const time = moment().toISOString()

        const notifications = await github.fetch(github_token, updated)

        await db.updateUser(username, {
          updated: time
        })

        if (notifications.length > 0) {
          await messaging.send(push_token, notifications)
        }
      } catch (error) {
        console.error(error)
      }
    })
  )

  response.type('text/plain').send('done')
})
