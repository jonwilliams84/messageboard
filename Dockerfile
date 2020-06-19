FROM nginx:1.15.2-alpine

COPY build /var/www
COPY ./run.sh /

RUN ls /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["./run.sh"]

LABEL MAINTAINER="jonwilliams84@gmail.com"
LABEL IMAGENAME=messageboard
LABEL OS=linux
LABEL VERSION=1.0
