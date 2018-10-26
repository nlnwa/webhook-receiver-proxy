const qs = require('querystring')

module.exports = ({ hostname = 'localhost', port = '443', path = '/', logger } = {}) => {
  const request = require('./request')(logger)

  const options = (data) => ({
    hostname,
    port,
    path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    }
  })

  function trigger (payload) {
    const data = qs.stringify(payload)
    request(options(data), data)
  }

  return trigger
}
