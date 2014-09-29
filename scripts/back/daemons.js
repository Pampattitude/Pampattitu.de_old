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

    var cleanFetchedLinks = function() {
        var cleanFetchedLinksScript = require(__dirname + '/cleanFetchedLinks');
        var waitTime = 60 * 60 * 1000; // Every 60 minutes

        return cleanFetchedLinksScript.execute(function(err) {
            if (err)
                consoleLib.error(err);

            return setTimeout(function() {
                return cleanFetchedLinks();
            }, waitTime);
        });
    };

    retrieveRedditPosts();
    cleanFetchedLinks();

    return ;
};

exports.execute = execute;
