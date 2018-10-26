const Koa = require('koa')
const app = new Koa()
const body = require('koa-json-body')
const config = require('./config')
const log = config.logger
const trigger = require('./upstream/gitlab/gitlab-ci')({ ...config.upstream.gitlab, log })

function identify (plugins) {
  return async function identify (ctx, next) {
    for (const plugin of plugins) {
      if (plugin.id(ctx)) {
        ctx.state.plugin = plugin
        break
      }
    }
    ctx.assert(ctx.state.plugin, 404)
    log.debug('Received webhook from:', ctx.state.plugin.name)
    await next()
    ctx.body = null // no content response
  }
}

async function authenticate (ctx, next) {
  ctx.assert(ctx.state.plugin.authenticate(ctx), 403)
  await next()
}

async function gate (ctx, next) {
  if (!ctx.state.plugin.gate || !ctx.state.plugin.gate(ctx)) {
    await next()
  } else {
    log.trace('Webhook blocked from upstream (gated):', ctx.state.plugin.name)
  }
}

async function transform (ctx, next) {
  try {
    ctx.state.payload = ctx.state.plugin.transform(ctx)
  } catch (error) {
    log.warn(error)
    return
  }
  if (ctx.state.payload) {
    log.trace(ctx.state.payload)
    await next()
  }
}

async function upstream (ctx) {
  trigger(ctx.state.payload)
}

log.info('Version:', config.app.version, 'Node:', process.version)

app.use(body(config.body))
app.use(identify(config.plugins))
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
