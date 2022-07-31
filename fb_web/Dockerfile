# FROM node:latest
FROM node:16.15.1
WORKDIR '/app'
COPY ./fb_web/package.json ./
# RUN npm install --force
RUN npm install --legacy-peer-deps
COPY ./fb_web .
RUN npm run build

FROM nginx
COPY --from=0 /app/build /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d
EXPOSE 80
