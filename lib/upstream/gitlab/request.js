const https = require('https')

function request (log) {
  return function request (options, data) {
    const req = https.request(options, (res) => {
      res.on('data', () => {})
      res.on('end', () => {})
    }).on('error', (e) => {
      log.error(e)
    })

    req.write(data)
    req.end()
  }
}

module.exports = logger => request(logger)
