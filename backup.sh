#!/bin/sh
FILENAME="/tmp/rethinkdb_backup-"$(date -u +%Y-%m-%d_%H-%M-%S)".tar.gz"

rethinkdb-dump -c rethinkdb -f $FILENAME && \
  node dist/ $FILENAME
