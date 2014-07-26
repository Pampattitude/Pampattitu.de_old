#!/bin/bash

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")

NODE_ENV=debug forever start --minUptime 3000 --spinSleepTime 30000 -l /data/log/beta-website.log -a "$SCRIPTPATH/front.js"
NODE_ENV=debug forever start --minUptime 3000 --spinSleepTime 30000 -l /data/log/beta-backoffice.log -a "$SCRIPTPATH/back.js"
