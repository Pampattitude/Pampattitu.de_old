#!/bin/bash

NODE_ENV=debug forever start --minUptime 3000 --spinSleepTime 30000 -l /data/log/beta-website.log -a front.js
NODE_ENV=debug forever start --minUptime 3000 --spinSleepTime 30000 -l /data/log/beta-backoffice.log -a back.js
