const { describe, it } = require('mocha')
const { assert } = require('chai')
const dockerhub = require('../lib/dockerhub')
const github = require('../lib/github')
const manual = require('../lib/manual')

describe('webhook-receiver-proxy', () => {
  describe('dockerhub plugin', function () {
    it('should transform docker hub json to gitlab ci trigger variables format', function () {
      const payload = require('./dockerhub-payload')
      const actual = dockerhub.transform({ request: { body: payload } })
      const expected = {
        'variables[WEBHOOK_ORIGIN]': 'Docker Hub',
        'variables[DOCKER_HUB_PUSH_TAG]': 'latest',
        'variables[DOCKER_HUB_REPO_NAME]': 'testhook',
        'variables[DOCKER_HUB_PUSHER]': 'trustedbuilder',
        'variables[DOCKER_HUB_REPO_OWNER]': 'svendowideit',
        'variables[DOCKER_HUB_REPO_URL]': 'https://registry.hub.docker.com/u/svendowideit/testhook/'
      }
      assert.deepEqual(actual, expected)
    })
  })

  describe('github plugin', function () {
    it('should transform github json to gitlab ci trigger variables format', function () {
      const payload = require('./github-payload')
      const actual = github.transform({ request: { body: payload } })
      const expected = {
        'variables[WEBHOOK_ORIGIN]': 'GitHub',
        'variables[GITHUB_REF]': 'refs/tags/simple-tag',
        'variables[GITHUB_HEAD]': '0000000000000000000000000000000000000000',
        'variables[GITHUB_REPO_NAME]': 'Hello-World',
        'variables[GITHUB_PUSHER]': 'Codertocat',
        'variables[GITHUB_REPO_OWNER]': 'Codertocat',
        'variables[GITHUB_REPO_URL]': 'https://github.com/Codertocat/Hello-World'
      }
      assert.deepEqual(actual, expected)
    })
  })

  describe('plugins', function () {
    function assertPlugin (plugin) {
      return plugin.id instanceof Function &&
        plugin.transform instanceof Function &&
        plugin.authenticate instanceof Function &&
        typeof plugin.name === 'string'
    }

    it('dockerhub should implement interface', () => assert.isTrue(assertPlugin(dockerhub)))

    it('github should implement interface', () => assert.isTrue(assertPlugin(github)))

    it('manual should implement interface', () => assert.isTrue(assertPlugin(manual)))
  })
})
