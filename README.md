# Environment
## Requirements
- Docker
- Docker Compose

## Recommended
It's useful at development.
- python 3.9.16
- pip
- node v14.17.0
- yarn

# Run for the production

## 0. Prepare for SSL

The following procedure is based on [this site](https://mindsers.blog/post/https-using-nginx-certbot-docker/).

```shell
cp nginx/data/nginx/app.conf.cert.ini nginx/data/nginx/app.conf
```

Replace `your.domain` with your actual domain in `nginx/data/nginx/app.conf`.

Run:
```shell
# start docker compose
bin/cert up

# Run in another shell
# Before run, REPLACE `<your.domain>` with your actual domain in the following command.
bin/cert run --rm  certbot certonly --webroot --webroot-path /var/www/certbot/ --dry-run -d <your.domain>
```

You should see `The dry run was successful.`.

After that, uncomment two lines in `docker-compose.cert.yml` to enable certbot create certificate and save in letsencrypt directory.

Then, run the following commands:
```shell
# In the first shell
bin/cert up

# In the second shell
# Before run, REPLACE `<your.domain>` with your actual domain in the following command.
bin/cert run --rm  certbot certonly --webroot --webroot-path /var/www/certbot/ -d <your.domain>
```

After successfully receiving certificate, replace app.conf with the one for running production app.
```shell
cp nginx/data/nginx/app.conf.ini nginx/data/nginx/app.conf
```

Replace `your.domain` with your actual domain in `nginx/data/nginx/app.conf` again.


## 1. Prepare .env

### `api_server/.env`
Create `<prj_root>/api_server/.env.prod` by copying `<prj_root>/api_server/.env.org`.
```shell
cp api_server/.env.org api_server/.env.prod
```

### `front/.env`
Create `<prj_root>/front/.env.prod` by copying `<prj_root>/front/.env.prod`.
```shell
cp front/.env.org front/.env.prod
```

## 2. Setup
```shell
bin/prod up --build

# At another terminal tab
# Migration
bin/prod_exec_api python manage.py migrate --noinput
# Collect static for django admin
bin/prod_exec_api python manage.py collectstatic --no-input --clear

# Create superuser
bin/prod_exec_api python manage.py createsuperuser
# >> Visible user id: (should be admin email address)
# >> Password: (password)
# >> Password (again): (password again)

# Stop
bin/prod down
```

## 3. Run
When starting the service for the production,
you should run in background.
(And you should set docker daemon to systemd.)

```shell
bin/prod up -d
```
When docker is restarted, all services will restart automatically,
because `restart: always` is set for all services.

## Health check
You can check states of all services by the following command.
```shell
bin/prod ps
```

## Delete data
### Delete only DB records
```shell
bin/prod up

# At another terminal window
bin/prod_exec_api python manage.py flush --no-input
```
Then, you should do migration and create superuser.

### Recreate DB resource
```shell
# Stop
bin/prod down

# Find db container name or ID
docker ps -a
# Delete db container
docker rm [db container name or ID]

# Find docker volume for the db container
docker volume ls
# Delete the volume
docker volume rm [volume name]
```
Then, follow the "Setup" step.

## Logging
Log files are generated for each container.

### See logs
In linux,
```shell
docker inspect -f "{{.LogPath}}" [container name or ID]
```

# Development

**Install all recommended prerequisites.**

## 1. Start API server
Run each command under appropriate directory.

1. Install python packages `pip install -r requirements.txt`
2. Start django `python manage.py runserver`
3. Migration: `python manage.py migrate`
4. Create superuser: `python manage.py createsuperuser`

- Django admin: http://localhost:8000/admin/

## 2. Start Frontend
Run each command under appropriate directory.

1. Install node packages: `yarn`
2. Start nuxt dev server: `yarn dev`

- Front page: http://localhost:3000/

## Test
```shell
# Test API server
python manage.py test

# Test frontend
yarn test
```
