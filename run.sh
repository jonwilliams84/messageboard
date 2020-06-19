#!/bin/sh
sed -i "s/localhost/${SERVER}/g" /var/www/env.js
nginx -g 'daemon off;'