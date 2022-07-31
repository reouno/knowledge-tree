#!/bin/sh
set -eux


SERVICE_NAME=db
HOST_BAK_DIR=backup

mkdir -p $HOST_BAK_DIR

# These values should be read from .env.prod
SQL_USER=db_user_name
SQL_DATABASE=db_name

# Set file name
BAK_FILE=bak_${SQL_DATABASE}_`date +'%Y%m%d-%H%M%S'`.sql

# Backup
bin/prod exec $SERVICE_NAME bash -c "pg_dump -U $SQL_USER $SQL_DATABASE > /tmp/$BAK_FILE"

# Copy to host
docker cp `bin/prod ps -q $SERVICE_NAME`:/tmp/${BAK_FILE} ./${HOST_BAK_DIR}/${BAK_FILE}

