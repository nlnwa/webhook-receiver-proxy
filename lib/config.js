const version = require('../package').version
const name = require('../package').name
const logger = require('./logger')(name)

const plugins = [
  require('./dockerhub'),
  require('./github')
]

module.exports = {
  app: { name, version },
  logger,
  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST || '0.0.0.0'
  },
  upstream: {
    hostname: process.env.UPSTREAM_HOST || 'localhost',
    port: process.env.UPSTREAM_PORT || '443',
    path: process.env.UPSTREAM_PATH || '/'
  },
  body: {
    fallback: true
  },
  origins: plugins
}
