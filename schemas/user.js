module.exports = {
  response: {
    200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'number'
            },
            notifications: {
              type: 'boolean'
            },
            githubToken: {
              type: 'string'
            },
            deviceToken: {
              type: 'string'
            },
            authToken: {
              type: 'string'
            }
          }
        }
      }
    }
  }
}
