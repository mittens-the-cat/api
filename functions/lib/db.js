const admin = require('firebase-admin')
const functions = require('firebase-functions')

class Database {
  constructor() {
    admin.initializeApp(functions.config().firebase)
  }

  async getUsers() {
    const snapshot = await admin
      .firestore()
      .collection('users')
      .where('github_token', '>', '')
      .get()

    return snapshot.docs.map(user => user.data())
  }

  updateUser(id, data) {
    return admin
      .firestore()
      .collection('users')
      .doc(id)
      .set(data, {
        merge: true
      })
  }
}

module.exports = new Database()
