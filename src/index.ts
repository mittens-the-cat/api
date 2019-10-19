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
    users.map(
      async ({ github_token, push_token, uid, updated_at, username }) => {
        try {
          const notifications = await github.getNotifications(github_token)

          await db.updateUser(username, {
            updated_at: moment().toISOString()
          })

          const fresh = notifications.filter(notification =>
            notification.updated_at.isAfter(updated_at)
          )

          if (fresh.length > 0) {
            await messaging.send(push_token, fresh)
          } else {
            await messaging.badge(push_token, notifications.length)
          }
        } catch (error) {
          await db.deleteUser(uid, username)
        }
      }
    )
  )

  response.type('text/plain').send('done')
})
