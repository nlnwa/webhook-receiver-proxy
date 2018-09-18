const Koa = require('koa')
const app = new Koa()
const body = require('koa-json-body')
const trigger = require('./trigger')
const config = require('./config')
const log = config.logger

function identify (identifiers) {
  return async function identify (ctx, next) {
    for (const id of identifiers) {
      if (id(ctx)) {
        break // found
      }
    }
    ctx.assert(ctx.state.origin, 400)
    await next()
  }
}

async function authenticate (ctx, next) {
  ctx.assert(ctx.state.origin.authenticate(ctx), 403)
  await next()
}

async function transform (ctx, next) {
  ctx.state.payload = ctx.state.origin.transform(ctx.request.body)
  await next()
}

async function upstream (ctx, next) {
  trigger(ctx.state.payload)
  await next()
}

log.info('Version:', config.app.version, 'Node:', process.version)

app.use(body(config.body))
app.use(identify(config.identifiers))
app.use(authenticate)
app.use(transform)
app.use(upstream)

app.listen(
  config.server.port,
  config.server.host,
  () => {
    log.info(`Listening on ${config.server.host}:${config.server.port}`)
  })
