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
    users.map(async ({ github_token, push_token, uid, username }) => {
      try {
        const notifications = await github.getNotifications(github_token)

        await db.updateUser(username, {
          updated_at: moment().toISOString()
        })

        const unread = notifications.filter(({ unread }) => unread)

        if (unread.length > 0) {
          await messaging.send(push_token, unread)
        } else {
          await messaging.badge(push_token, 0)
        }
      } catch (error) {
        await db.deleteUser(uid, username)
      }
    })
  )

  response.type('text/plain').send('done')
})
