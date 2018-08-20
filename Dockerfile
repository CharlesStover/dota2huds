FROM node:alpine AS builder
WORKDIR /var/www
COPY package.json .
RUN yarn build

FROM nginx:alpine
LABEL Author="Charles Stover"
RUN rm -rf /etc/nginx/conf.d
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /var/www/build /var/www
COPY public /var/www
COPY src/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
