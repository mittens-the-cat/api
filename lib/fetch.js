const fetch = require('node-fetch')

module.exports = async (
  url,
  method = 'GET',
  body = undefined,
  headers = {}
) => {
  const response = await fetch(url, {
    headers,
    method,
    body: JSON.stringify(body)
  })

  const { message, status } = response

  if (status >= 400) {
    throw new Error(message)
  }

  const json = await response.json()

  if (url.includes('api.github.com')) {
    json.limit = {
      limit: parseInt(response.headers.get('x-ratelimit-limit')),
      remaining: parseInt(response.headers.get('x-ratelimit-remaining')),
      reset: parseInt(response.headers.get('x-ratelimit-reset')),
      interval: parseInt(response.headers.get('x-poll-interval'))
    }
  }

  return json
}
