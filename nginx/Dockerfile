# FROM node:latest
FROM nginx:1.21.3-alpine
WORKDIR '/backend'
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./uwsgi_params /etc/nginx/uwsgi_params
