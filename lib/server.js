const Koa = require('koa')
const app = new Koa()
const body = require('koa-json-body')
const trigger = require('./trigger')
const config = require('./config')
const log = config.logger

function identify (origins) {
  return async function identify (ctx, next) {
    for (const origin of origins) {
      if (origin.id(ctx)) {
        ctx.state.origin = origin
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

async function gate (ctx, next) {
  if (ctx.state.origin.gate && ctx.state.origin.gate(ctx)) {

  } else {
    await next()
  }
}

async function transform (ctx, next) {
  ctx.state.payload = ctx.state.origin.transform(ctx)
  if (ctx.state.payload) {
    await next()
  }
}

async function upstream (ctx, next) {
  trigger(ctx.state.payload)
  await next()
}

log.info('Version:', config.app.version, 'Node:', process.version)

app.use(body(config.body))
app.use(identify(config.origins))
app.use(authenticate)
app.use(gate)
app.use(transform)
app.use(upstream)

app.listen(
  config.server.port,
  config.server.host,
  () => {
    log.info(`Listening on ${config.server.host}:${config.server.port}`)
  })
