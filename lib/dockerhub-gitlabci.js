function transform (payload) {
  return `
  variables[tag]=${payload.push_data.tag}
  variables[name]=${payload.repository.name}
  variables[repo]=${payload.repository.repo_name}
  variables[repo_url]=${payload.repository.repo_url}
  `
}

module.exports = {
  transform
}
