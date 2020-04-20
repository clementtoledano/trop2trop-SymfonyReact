FROM nginx:latest

ENV DEBIAN_FRONTEND="noninteractive" \
    SYMFONY_ALLOW_APPDEV=1 \
    COMPOSER_ALLOW_SUPERUSER=1

COPY conf/symfony.conf /etc/nginx/conf.d/default.conf
