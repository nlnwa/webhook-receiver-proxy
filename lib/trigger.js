const request = require('./request')
const querystring = require('querystring')
const upstream = require('./config').upstream
const hostname = upstream.hostname
const port = upstream.port
const path = upstream.path

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

function trigger (object) {
  const data = querystring.stringify(object)
  request(options(data), data)
}

module.exports = trigger
