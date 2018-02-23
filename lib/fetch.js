const fetch = require('node-fetch')

module.exports = async (
  url,
  method = 'GET',
  body = undefined,
  headers = {}
) => {
  const response = await fetch(url, {
    body,
    method
  })

  const { message, status } = response

  if (status >= 400) {
    throw new Error(message)
  }

  return response.json()
}
