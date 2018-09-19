const apiKey = process.env.DEBUG_API_KEY
const name = 'Manual'

function id (ctx) {
  return ctx.query['manual'] !== undefined
}

function authenticate (ctx) {
  return apiKey === ctx.query['api_key']
}

function transform (ctx) {
  return Object.keys(ctx.query).reduce((acc, key) => {
    if (key !== 'api_key' && key !== 'manual') {
      acc[`variables[${key}]`] = ctx.query[key]
    }
    return acc
  }, { 'variables[WEBHOOK_ORIGIN]': name })
}

module.exports = {
  name,
  transform,
  authenticate,
  id
}
