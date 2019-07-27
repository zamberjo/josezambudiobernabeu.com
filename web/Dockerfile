FROM node:10-stretch

ARG NODE_UID=501
ARG NODE_GID=20

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN set -ex \
    && groupmod -o -g "${NODE_GID}" node \
    && usermod -o -u "${NODE_UID}" -g "${NODE_GID}" node

USER node

COPY entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]
