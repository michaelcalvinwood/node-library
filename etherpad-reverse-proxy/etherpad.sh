#!/bin/bash

pm2 start /opt/etherpad/etherpad-lite/src/node/server.js
pm2 start proxy-final.js

