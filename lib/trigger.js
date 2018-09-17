const {request} = require('./request')
const upstream = require('./config').upstream

const options = (data) => ({
  host: upstream.host,
  port: upstream.port,
  path: upstream.path,
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
    'Content-Length': Buffer.byteLength(data)
  }
})

function trigger (data) {
  request(options(data), data)
}

module.exports = {
  trigger
}
