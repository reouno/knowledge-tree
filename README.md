# Environment
## Requirements
- Docker
- Docker Compose

## Recommended
It's useful at development.
- python 3.9.9
- pip
- node v14.17.0
- yarn

# Run for the production

## 1. Prepare .env
Create `<prj_root>/api_server/.env.prod`.
Example of the environment variables are the followings.
```dotenv
DJANGO_SETTINGS_MODULE=api_server.settings.prod
DJANGO_ENV=prod
DEBUG=0
SECRET_KEY=gkj36hk34543gi54
DJANGO_ALLOWED_HOSTS=https://your-host1.com,https://your-host2.com
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=db_name
SQL_USER=db_user_name
SQL_PASSWORD=db_password
SQL_HOST=db
SQL_PORT=5432
DATABASE=postgres
TIMEZONE=Asia/Tokyo
DJANGO_LOG_LEVEL=INFO
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
