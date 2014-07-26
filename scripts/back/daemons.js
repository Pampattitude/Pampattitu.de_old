'use strict';

var consoleLib = require(__dirname + '/../../lib/console');

var execute = function() {
    var retrieveRedditPosts = function() {
        var getLatestRedditPostsScript = require(__dirname + '/getLatestRedditPosts');
        var waitTime = 60 * 60 * 1000; // Every 60 minutes

        return getLatestRedditPostsScript.execute(function(err) {
            if (err)
                consoleLib.error(err);

            return setTimeout(function() {
                return retrieveRedditPosts();
            }, waitTime);
        });
    };

    retrieveRedditPosts();

    return ;
};

exports.execute = execute;
