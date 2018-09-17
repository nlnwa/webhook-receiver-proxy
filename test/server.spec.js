const { describe, it, before, after } = require('mocha')
const { assert } = require('chai')
const http = require('http')
const payload = require('./dockerhub-payload')
const server = require('../lib/server')
const config = require('../lib/config')

describe('webhook-receiver-proxy', () => {
  before(function () {
    config.trigger = (payload) => {
      const expected = `
  variables[tag]=latest
  variables[name]=testhook
  variables[repo]=svendowideit/testhook
  variables[repo_url]=https://registry.hub.docker.com/u/svendowideit/testhook/
  `
      assert.equal(expected, payload)
    }
    this.connection = server(config)
  })

  after(function () {
    this.connection.close()
  })

  it('should transform docker hub json to gitlab ci trigger variables format', function (done) {
    const options = {
      port: config.server.port,
      method: 'POST'
    }
    const req = http.request(options, (res) => {
      res.on('data', () => {})
      res.on('end', () => {
        done()
      })
    })
    req.write(JSON.stringify(payload))
    req.end()
  })
})
