FROM node:latest AS builder
WORKDIR /app/
COPY /app .
RUN npm install --progress=false \
 && npm run-script build


FROM nginx:1.15.2-alpine


COPY --from=builder /app/build /var/www
COPY run.sh .

RUN ls /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

#ENTRYPOINT ["nginx","-g","daemon off;"]
ENTRYPOINT [ "./run.sh" ]

LABEL MAINTAINER="jonwilliams84@gmail.com"
LABEL IMAGENAME=messageboard
LABEL OS=linux
LABEL VERSION=1.0
