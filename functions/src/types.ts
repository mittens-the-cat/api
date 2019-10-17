export interface Notification {
  id: string
  body: string
  repository: string
}

export interface User {
  github_token: string
  push_token: string
  uid: string
  updated: string
  username: string
}

export interface UserUpdate {
  github_token?: string
  push_token?: string
  updated?: string
  username?: string
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
  updated_at: string
}
