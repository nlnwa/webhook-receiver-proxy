const { describe, it } = require('mocha')
const { assert } = require('chai')
const payload = require('./dockerhub-payload')
const dockerHubToGitlabCI = require('../lib/dockerhub-transformer')

describe('webhook-receiver-proxy', () => {
  it('should transform docker hub json to gitlab ci trigger variables format', function () {
    const expected = {
      'variables[DOCKER_HUB_PUSH_TAG]': 'latest',
      'variables[DOCKER_HUB_REPO_NAME]': 'testhook',
      'variables[DOCKER_HUB_PUSHER]': 'trustedbuilder',
      'variables[DOCKER_HUB_REPO_OWNER]': 'svendowideit',
      'variables[DOCKER_HUB_REPO_URL]': 'https://registry.hub.docker.com/u/svendowideit/testhook/'
    }

    const actual = dockerHubToGitlabCI(payload)

    assert.deepEqual(actual, expected)
  })
})
