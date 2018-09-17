const version = require('../package').version
const name = require('../package').name
const logger = require('./logger')(name)
const {transform} = require('./dockerhub-gitlabci')
const {trigger} = require('./trigger')

module.exports = {
  app: {name, version},
  logger,
  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST || '0.0.0.0'
  },
  upstream: {
    host: process.env.UPSTREAM_HOST || 'localhost',
    port: process.env.UPSTREAM_PORT || '443',
    path: process.env.UPSTREAM_PATH || '/'
  },
  body: {
    fallback: true
  },
  transform,
  trigger,
  apiKey: process.env.API_KEY || undefined
}
