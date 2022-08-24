#!/bin/sh
set -eux

BAK_FILE=$1

SERVICE_NAME=db
HOST_BAK_DIR=backup

# These values should be read from .env.prod
SQL_USER=db_user_name
SQL_DATABASE=db_name

# Copy file to container
docker cp ./${HOST_BAK_DIR}/${BAK_FILE} `bin/prod ps -q $SERVICE_NAME`:/tmp/${BAK_FILE}

# Restore dumped file
bin/prod exec $SERVICE_NAME bash -c "psql -U $SQL_USER -d $SQL_DATABASE -f /tmp/${BAK_FILE}"
