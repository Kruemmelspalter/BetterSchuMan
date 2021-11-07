#!/usr/bin/env sh
cd "$0"/.. || exit
node main.js|tee /var/log/betterschuman.log