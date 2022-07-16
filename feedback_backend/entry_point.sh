#!/bin/sh

function wait_mysql() {
    until mysqladmin -uorion -porion -h feedback_db ping ; do
    sleep 1
    done
}

case "${ENV}" in
    prd)
        wait_mysql
        ln -s /backend/feedback_backend/config/.env.prd /backend/feedback_backend/config/.env
        ;;
    stg)
        wait_mysql
        ln -s /backend/feedback_backend/config/.env.stg /backend/feedback_backend/config/.env
        ;;
    dev)
        ln -s /backend/feedback_backend/config/.env.dev /backend/feedback_backend/config/.env
        ;;
    *)
        ln -s /backend/feedback_backend/config/.env.dev /backend/feedback_backend/config/.env
        ;;
esac

python feedback_backend/manage.py makemigrations users posts
python feedback_backend/manage.py migrate
python feedback_backend/manage.py showmigrations
python feedback_backend/manage.py loaddata feedback_backend/users/fixtures/initial_users_data.json
python feedback_backend/manage.py loaddata feedback_backend/posts/fixtures/initial_posts_data.json

exec "$@"