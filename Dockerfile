FROM nginx:alpine
RUN yarn build
COPY /dist /var/www
COPY /public /var/www
