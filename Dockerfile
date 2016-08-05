FROM mhart/alpine-node:6.3.1
MAINTAINER nukr <nukrs.w@gmail.com>

COPY package.json /tmp/package.json

RUN apk add --no-cache make gcc g++ python py-pip curl libc6-compat \
&& pip install rethinkdb \
&& cd /tmp && npm install --production \
&& mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/ \
&& apk del make gcc g++ python py-pip curl libc6-compat

WORKDIR /opt/app
COPY . /opt/app

CMD ["node", "dist/index.js"]
