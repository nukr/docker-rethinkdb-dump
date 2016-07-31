FROM mhart/alpine-node:6.3.1
MAINTAINER nukr <nukrs.w@gmail.com>

RUN apk add --no-cache make gcc g++ python py-pip curl libc6-compat && pip install rethinkdb

COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

RUN npm install babel-cli -g

WORKDIR /opt/app
COPY . /opt/app

CMD ["./backup.sh"]
