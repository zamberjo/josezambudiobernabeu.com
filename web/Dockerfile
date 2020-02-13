FROM node:10-stretch as base

ARG NODE_UID=501
ARG NODE_GID=20

ARG REACT_APP_DEBUG=false
ENV REACT_APP_DEBUG=${REACT_APP_DEBUG}

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN set -ex \
    && groupmod -o -g "${NODE_GID}" node \
    && usermod -o -u "${NODE_UID}" -g "${NODE_GID}" node

USER node

COPY entrypoint.sh /

EXPOSE 3000/tcp

ENTRYPOINT ["/entrypoint.sh"]