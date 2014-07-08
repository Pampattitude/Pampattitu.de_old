'use strict';

var consoleLib = require(__dirname + '/../../lib/console');

var execute = function() {
    var calculateTagsDaemon = function() {
        var calculateTagsScript = require(__dirname + '/calculateTags');
        var waitTime = 10 * 60 * 1000; // Every 10 minutes

        return calculateTagsScript.execute(function(err) {
            if (err)
                consoleLib.error(err);

            return setTimeout(function() {
                return calculateTagsDaemon();
            }, waitTime);
        });
    };

    var removeOldTagsDaemon = function() {
        var removeOldTagsScript = require(__dirname + '/removeOldTags');
        var waitTime = 10 * 60 * 1000; // Every 10 minutes

        return removeOldTagsScript.execute(function(err) {
            if (err)
                consoleLib.error(err);

            return setTimeout(function() {
                return removeOldTagsDaemon();
            }, waitTime);
        });
    };

    calculateTagsDaemon();
    removeOldTagsDaemon();

    return ;
};

exports.execute = execute;
