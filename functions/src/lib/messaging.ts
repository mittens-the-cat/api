import * as admin from 'firebase-admin'

import { Notification } from '../types'

class Messaging {
  async send(token: string, notifications: Notification[]): Promise<void> {
    await admin.messaging().sendAll([
      ...notifications.map(({ body, id, repository }) => ({
        android: {
          collapseKey: id
        },
        apns: {
          headers: {
            'apns-collapse-id': id
          },
          payload: {
            aps: {
              badge: notifications.length
            }
          }
        },
        notification: {
          body,
          title: repository
        },
        token
      }))
    ])
  }
}

export default new Messaging()
