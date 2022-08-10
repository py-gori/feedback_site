#!/bin/sh

function wait_mysql() {
    until mysqladmin -uorion -porion -h feedback_db ping ; do
    sleep 1
    done
}

case "${ENV}" in
    prd)
        wait_mysql
        ln -s /app/config/.env.prd /app/config/.env
        ;;
    stg)
        wait_mysql
        ln -s /app/config/.env.stg /app/config/.env
        ;;
    dev)
        ln -s /app/config/.env.dev /app/config/.env
        ;;
    *)
        ln -s /app/config/.env.prd /app/config/.env
        ;;
esac

python manage.py makemigrations users posts
python manage.py migrate
python manage.py showmigrations
python manage.py loaddata users/fixtures/initial_users_data.json
python manage.py loaddata posts/fixtures/initial_posts_data.json

exec "$@"