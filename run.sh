#!/bin/sh
sed -i "s/ADMIN_ADDRESS/${SERVER}/g" /www/var/static/js/main.*.chunk.js
nginx -g daemon off