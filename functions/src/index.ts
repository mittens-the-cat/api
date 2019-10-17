import { https } from 'firebase-functions'
import moment from 'moment'

import db from './lib/db'
import github from './lib/github'
import messaging from './lib/messaging'
import { User } from './types'

export const auth = https.onCall(async data => {
  const { code } = data

  const { access_token } = await github.auth(code)

  return {
    access_token
  }
})

export const fetch = https.onRequest(async (request, response) => {
  const users: User[] = await db.getUsers()

  await Promise.all(
    users.map(async ({ github_token, push_token, updated, username }) => {
      try {
        const notifications = await github.fetch(github_token, updated)

        await db.updateUser(username, {
          updated: moment().toISOString()
        })

        if (notifications.length > 0) {
          await messaging.send(push_token, notifications)
        }
      } catch (error) {
        await db.deleteUser(username)
      }
    })
  )

  response.type('text/plain').send('done')
})
