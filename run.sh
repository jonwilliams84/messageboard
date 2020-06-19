#!/bin/sh
sed -i "s/localhost/${SERVER}/g" /www/var/env.js
nginx -g 'daemon off;'