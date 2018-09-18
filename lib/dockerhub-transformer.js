function transform (payload) {
  return {
    'variables[DOCKER_HUB_PUSH_TAG]': payload.push_data.tag,
    'variables[DOCKER_HUB_PUSHER]': payload.push_data.pusher,
    'variables[DOCKER_HUB_REPO_NAME]': payload.repository.name,
    'variables[DOCKER_HUB_REPO_OWNER]': payload.repository.owner,
    'variables[DOCKER_HUB_REPO_URL]': payload.repository.repo_url
  }
}

module.exports = transform
