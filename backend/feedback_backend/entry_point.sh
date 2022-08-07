#!/bin/sh

function wait_mysql() {
    until mysqladmin -uorion -porion -h feedback_db ping ; do
    sleep 1
    done
}

case "${ENV}" in
    prd)
        wait_mysql
        ln -s /backend/config/.env.prd /backend/config/.env
        ;;
    stg)
        wait_mysql
        ln -s /backend/config/.env.stg /backend/config/.env
        ;;
    dev)
        ln -s /backend/config/.env.dev /backend/config/.env
        ;;
    *)
        ln -s /backend/config/.env.prd /backend/config/.env
        ;;
esac

python manage.py makemigrations users posts
python manage.py migrate
python manage.py showmigrations
python manage.py loaddata users/fixtures/initial_users_data.json
python manage.py loaddata posts/fixtures/initial_posts_data.json

exec "$@"