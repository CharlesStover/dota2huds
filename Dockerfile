FROM nginx:alpine
RUN yarn build
COPY /dist /var/www
COPY /public /var/www
COPY /src/hud_skins /var/www/hud_skins
