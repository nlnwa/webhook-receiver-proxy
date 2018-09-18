const version = require('../package').version
const name = require('../package').name
const logger = require('./logger')(name)
const URL = require('url').URL

const origins = {
  dh: {
    name: 'docker hub',
    transform: require('./dockerhub-transformer'),
    authenticate: (ctx) => process.env.API_KEY === ctx.query['api_key']
  }
}

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
  identifiers: [
    function dockerHub (ctx) {
      try {
        const url = new URL(ctx.request.body['callback_url'])
        if (url.hostname === 'registry.hub.docker.com') {
          ctx.state.origin = origins.dh
          return true
        }
      } catch (_) {
      }
      return false
    }
  ]
}
