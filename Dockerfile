FROM node:alpine AS builder
WORKDIR /var/www
COPY helpers /var/www/helpers
COPY hud_skins /var/www/hud_skins
COPY scripts /var/www/scripts
COPY src /var/www/src
COPY package.json /var/www
RUN yarn build

FROM nginx:alpine
LABEL Author="Charles Stover"
RUN rm -rf /etc/nginx/conf.d
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /var/www/build /var/www
COPY hud_skins /var/www
COPY public /var/www
COPY src/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
