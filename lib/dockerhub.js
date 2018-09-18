const crypto = require('crypto')
const apiKey = process.env.API_KEY

function authenticate (ctx) {
  return crypto.timingSafeEqual(apiKey, ctx.query['api_key'])
}

function transform (payload) {
  return {
    'variables[DOCKER_HUB_PUSH_TAG]': payload.push_data.tag,
    'variables[DOCKER_HUB_PUSHER]': payload.push_data.pusher,
    'variables[DOCKER_HUB_REPO_NAME]': payload.repository.name,
    'variables[DOCKER_HUB_REPO_OWNER]': payload.repository.owner,
    'variables[DOCKER_HUB_REPO_URL]': payload.repository.repo_url
  }
}

function id (ctx) {
  try {
    const url = new URL(ctx.request.body['callback_url'])
    if (url.hostname === 'registry.hub.docker.com') {
      return true
    }
  } catch (_) {
  }
  return false
}

module.exports = {
  name: 'docker hub',
  transform,
  authenticate,
  id
}
