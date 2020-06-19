FROM nginx:1.15.2-alpine

ADD https://gitlab.sirfragalot.com/code-stash/messageboard/-/jobs/artifacts/master/browse?job=build_app /var/www
#COPY ./build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]

LABEL MAINTAINER="jonwilliams84@gmail.com"
LABEL IMAGENAME=messageboard
LABEL OS=linux
LABEL VERSION=1.0
