# FROM node:latest
FROM node:16.15.1
WORKDIR '/web'
# COPY ./feedback_web/package.json ./
# RUN npm install --force
# RUN npm install --legacy-peer-deps
COPY . /web
# RUN npm run build
# RUN npm run test

# FROM nginx
# COPY --from=0 /app/build /usr/share/nginx/html
# COPY ./default.conf /etc/nginx/conf.d
# EXPOSE 80