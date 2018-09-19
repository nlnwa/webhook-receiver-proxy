FROM node:8-alpine

LABEL maintainer="nettarkivet@nb.no"

COPY package.json yarn.lock /usr/src/app/
WORKDIR /usr/src/app

RUN yarn install --production && yarn cache clean

COPY . .

ENV HOST=0.0.0.0 \
    PORT=80 \
    GITHUB_API_KEY="" \
    DOCKER_HUB_API_KEY="" \
    UPSTREAM_HOST=localhost \
    UPSTREAM_PORT=443 \
    UPSTREAM_PATH=/ \
    LOG_LEVEL=info

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/node", "index.js"]
