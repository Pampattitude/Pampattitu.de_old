#!/bin/sh

start() {
    echo "Starting..."

    FOREVERNBR=`forever list | wc -l`

    if [ "$FOREVERNBR" != "1" ]; then
        echo "Could not start, scripts already running under forever:" 1>&2
        forever list
        return 1
    fi

    SCRIPT=$(readlink -f "$0")
    SCRIPTPATH=$(dirname "$SCRIPT")

    NODE_ENV=debug forever start --minUptime 3000 --spinSleepTime 30000 -l /data/log/beta-website.log -a "$SCRIPTPATH/front.js"
    NODE_ENV=debug forever start --minUptime 3000 --spinSleepTime 30000 -l /data/log/beta-backoffice.log -a "$SCRIPTPATH/back.js"

    echo "Started!"

    return 0
}

stop() {
    echo "Stopping..."
    forever stopall
    echo "Stopped!"
    return 0
}

restart() {
    stop && echo && start
}

list() {
    forever list
    return 0
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    list)
        list
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|list}"
esac
