import axios from 'axios'
import functions from 'firebase-functions'
import moment from 'moment'

import { GitHubAuth, GitHubNotification, Notification } from '../types'

class GitHub {
  async auth(code: string): Promise<GitHubAuth> {
    const {
      github: { id, secret }
    } = functions.config()

    const { data } = await axios.request<GitHubAuth>({
      headers: {
        accept: 'application/json'
      },
      url: `https://github.com/login/oauth/access_token?client_id=${id}&client_secret=${secret}&code=${code}`
    })

    return data
  }

  async getNotifications(token: string): Promise<Notification[]> {
    const { data, status } = await axios.request<GitHubNotification[]>({
      headers: {
        authorization: `token ${token}`,
        'user-agent': 'Mittens'
      },
      params: {
        all: true
      },
      url: 'https://api.github.com/notifications'
    })

    if (status !== 200) {
      throw new Error('GitHub error')
    }

    return data.map(
      ({
        id,
        repository: { full_name },
        subject: { title, type, url },
        unread,
        updated_at
      }) => ({
        body: title,
        id,
        repository: full_name,
        type,
        unread,
        updated_at: moment(updated_at),
        url
      })
    )
  }
}

export default new GitHub()
