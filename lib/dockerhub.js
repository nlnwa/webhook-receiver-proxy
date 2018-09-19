const crypto = require('crypto')
const URL = require('url').URL
const log = require('./config').logger
const apiKey = process.env.DOCKER_HUB_API_KEY
const name = 'Docker Hub'

function id (ctx) {
  const payload = ctx.request.body
  try {
    const url = new URL(payload['repository']['repo_url'])
    if (url.hostname === 'hub.docker.com') {
      return true
    }
  } catch (_) {
  }
  return false
}

function authenticate (ctx) {
  return crypto.timingSafeEqual(Buffer.from(apiKey), Buffer.from(ctx.query['api_key']))
}

function transform (ctx) {
  const payload = ctx.request.body
  try {
    return {
      'variables[WEBHOOK_ORIGIN]': name,
      'variables[DOCKER_HUB_PUSH_TAG]': payload['push_data']['tag'],
      'variables[DOCKER_HUB_PUSHER]': payload['push_data']['pusher'],
      'variables[DOCKER_HUB_REPO_NAME]': payload['repository']['name'],
      'variables[DOCKER_HUB_REPO_OWNER]': payload['repository']['owner'],
      'variables[DOCKER_HUB_REPO_URL]': payload['repository']['repo_url']
    }
  } catch (_) {
    log.warn(_)
    return {}
  }
}

module.exports = {
  name,
  transform,
  authenticate,
  id
}
