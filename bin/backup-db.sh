#!/bin/sh
set -eux

SERVICE_NAME=db

# These values should be read from .env.prod
SQL_USER=db_user_name
SQL_DATABASE=db_name

# Set file name
BAK_FILE=bak_${SQL_DATABASE}_`date +'%Y%m%d-%H%M%S'`.sql

# Backup
bin/prod exec -e BAK_FILE=$BAK_FILE $SERVICE_NAME bash -c "pg_dump -U $SQL_USER $SQL_DATABASE > /tmp/$BAK_FILE"

# Copy to host
docker cp `bin/prod ps -q $SERVICE_NAME`:/tmp/${BAK_FILE} ./backup/$BAK_FILE

