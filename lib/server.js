const Koa = require('koa')
const app = new Koa()
const body = require('koa-json-body')
const dockerhubToGitlab = require('./dockerhub-gitlabci')
const triggerGitlabCI = require('./trigger')
const config = require('./config')
const log = config.logger

function auth (apiKey) {
  return async function auth (ctx, next) {
    ctx.assert(apiKey === ctx.query.api_key, 401, 'Unauthorized')
    await next()
    ctx.body = null // no content response
  }
}

function transform (fn) {
  return async function transform (ctx, next) {
    ctx.state.payload = fn(ctx.request.body)
    await next()
  }
}

function trigger (fn) {
  return async function trigger (ctx, next) {
    fn(ctx.state.payload)
    await next()
  }
}

log.info('Version:', config.app.version, 'Node:', process.version)

app.use(auth(config.apiKey))
app.use(body(config.body))
app.use(transform(dockerhubToGitlab))
app.use(trigger(triggerGitlabCI))

app.listen(
  config.server.port,
  config.server.host,
  () => {
    log.info(`Listening on ${config.server.host}:${config.server.port}`)
  })
