const https = require('https')
const log = require('./config').logger

function request (options, data) {
  https.request(options, (res) => {
    res.on('data', () => {})
    res.on('end', () => {})
  }).on('error', (e) => {
    log.error(e)
  }).write(data)
    .end()
}

module.exports = {
  request
}
