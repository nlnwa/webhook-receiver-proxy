const crypto = require('crypto')
const apiKey = process.env.GITHUB_API_KEY
const name = 'github'

function id (ctx) {
  const payload = ctx.request.body
  try {
    const url = new URL(payload['repository']['url'])
    if (url.hostname === 'github.com') {
      return true
    }
  } catch (_) {
  }
  return false
}

function authenticate (ctx) {
  const payload = ctx.request.body
  const hubSignature = ctx.request.headers['X-Hub-Signature']
  const signature = sign(payload, apiKey)
  return crypto.timingSafeEqual(hubSignature, signature)
}

function sign (payload, key) {
  return 'sha1=' +
    crypto
      .createHmac('sha1', key)
      .update(JSON.stringify(payload))
      .digest('hex')
}

function gate (ctx) {
  if (ctx.request.headers['X-GitHub-Event'] === 'ping') {
    return true
  }
  return false
}

function transform (payload) {
  return {
    'variables[GITHUB_REF]': payload.ref,
    'variables[GITHUB_HEAD]': payload.head,
    'variables[GITHUB_REPO_NAME]': payload.repository.name,
    'variables[GITHUB_REPO_OWNER]': payload.repository.owner.name,
    'variables[GITHUB_REPO_URL]': payload.repository.html_url,
    'variables[GITHUB_PUSHER]': payload.pusher.name
  }
}

module.exports = {
  name,
  gate,
  transform,
  authenticate,
  id
}
