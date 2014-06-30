#!/bin/bash

forever start --minUptime 3000 --spinSleepTime 30000 -l /data/log/website.log -a app.js
