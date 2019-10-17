import { firestore, initializeApp } from 'firebase-admin'
import { config } from 'firebase-functions'

import { User, UserUpdate } from '../types'

class Database {
  constructor() {
    initializeApp(config().firebase)
  }

  async getUsers(): Promise<User[]> {
    const snapshot = await firestore()
      .collection('users')
      .where('push_token', '>', '')
      .get()

    return snapshot.docs.map(user => user.data() as User)
  }

  async updateUser(id: string, data: UserUpdate): Promise<void> {
    await firestore()
      .collection('users')
      .doc(id)
      .set(data, {
        merge: true
      })
  }

  async deleteUser(username: string): Promise<void> {
    await firestore()
      .collection('users')
      .doc(username)
      .update({
        github_token: firestore.FieldValue.delete(),
        push_token: firestore.FieldValue.delete()
      })
  }
}

export default new Database()
