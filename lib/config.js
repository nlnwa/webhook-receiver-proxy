const version = require('../package').version
const name = require('../package').name
const logger = require('./logger')(name)

module.exports = {
  app: { name, version },
  logger,
  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST || '0.0.0.0'
  },
  plugins: [
    require('./plugins/dockerhub')(process.env.DOCKER_HUB_API_KEY),
    require('./plugins/github')(process.env.GITHUB_API_KEY)
  ],
  upstream: {
    gitlab: {
      hostname: process.env.UPSTREAM_HOST || 'localhost',
      port: process.env.UPSTREAM_PORT || '443',
      path: process.env.UPSTREAM_PATH || '/'
    }
  },
  body: {
    fallback: true
  }
}
