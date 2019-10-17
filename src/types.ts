import { Moment } from 'moment'

export interface Notification {
  id: string
  body: string
  repository: string
  unread: boolean
  updated_at: Moment
}

export interface User {
  github_token: string
  push_token: string
  uid: string
  username: string
  updated_at: string
}

export interface UserUpdate {
  updated_at?: string
}

export interface GitHubAuth {
  access_token: string
}

export interface GitHubNotification {
  id: string
  repository: {
    full_name: string
  }
  subject: {
    title: string
    type: string
    url: string
  }
  unread: boolean
  updated_at: string
}
