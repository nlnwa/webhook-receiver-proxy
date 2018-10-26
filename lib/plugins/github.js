const assert = require('assert')
const crypto = require('crypto')
const URL = require('url').URL
const name = 'GitHub'

function id (ctx) {
  const payload = ctx.request.body
  try {
    const url = new URL(payload['repository']['html_url'])
    if (url.hostname === 'github.com') {
      return true
    }
  } catch (_) {
  }
  return false
}

function authenticate (apiKey) {
  return function (ctx) {
    const payload = ctx.request.body
    const hubSignature = ctx.request.headers['x-hub-signature']
    const signature = sign(payload, apiKey)
    return crypto.timingSafeEqual(Buffer.from(hubSignature), Buffer.from(signature))
  }
}

function sign (payload, key) {
  return 'sha1=' +
    crypto
      .createHmac('sha1', key)
      .update(JSON.stringify(payload))
      .digest('hex')
}

function gate (ctx) {
  const event = ctx.request.headers['x-github-event']
  return event === 'ping'
}

function transform (ctx) {
  const payload = ctx.request.body

  return {
    'variables[WEBHOOK_ORIGIN]': name,
    'variables[GITHUB_REF]': payload['ref'],
    'variables[GITHUB_HEAD]': payload['after'],
    'variables[GITHUB_REPO_NAME]': payload['repository']['name'],
    'variables[GITHUB_REPO_OWNER]': payload['repository']['owner']['name'],
    'variables[GITHUB_REPO_URL]': payload['repository']['html_url'],
    'variables[GITHUB_PUSHER]': payload['pusher']['name']
  }
}

module.exports = (apiKey) => {
  assert.ok(apiKey, 'Missing required API key for GitHub plugin')

  return {
    name,
    gate,
    transform,
    authenticate: authenticate(apiKey),
    id
  }
}
