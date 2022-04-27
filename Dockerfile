FROM node:18-bullseye as base

RUN set -ex \
    && groupmod -o -g "1002" node \
    && usermod -o -u "1002" -g "1002" node \
    && chown -R node. /usr/local/lib/node_modules \
    && npm install -g npm

USER node

COPY entrypoint.sh /

EXPOSE 3000/tcp
EXPOSE 10000

ENTRYPOINT ["/entrypoint.sh"]
