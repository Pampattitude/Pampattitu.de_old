var asyncLib = require('async');
var mongooseLib = require('mongoose');
var requestLib = require('request');

var consoleLib = require(__dirname + '/../../lib/console');

var FetchedLink = require(__dirname + '/../../models/fetchedLinks').model;

var config = {
    subReddits: ['node', 'nodejs', 'opengl', 'gamedev', 'cpp', 'programming', 'mongodb', 'gameassets', 'webspiration', 'webdev', 'opensource'],
    urlsToSkip: ['google', 'youtube', 'reddit', 'dailymotion', 'imgur', 'gfycat'],

    minScore: 3,
    minUpsPercentage: 60, // %
    allowSelfPost: false,
    allowBannedPost: false,

    minTimeForRequest: 2000, // ms, because 30 requests per minute tops
};

var execute = function(scriptCallback) {
    var postsToKeep = [];

    var tomorrow = function() {
        var tom = new Date();
        tom.setDate(tom.getDate() + 1);
        return tom;
    };

    return asyncLib.eachSeries(config.subReddits, function(subReddit, subRedditCallback) {
        var startTime = new Date();

        consoleLib.log('Getting latest relevant posts for subreddit /r/' + subReddit);
        return requestLib({
            uri: 'http://api.reddit.com/r/' + subReddit + '/new.json',
            method: 'GET',
        },
        function(err, res, body, warn) {
            if (err)
                return subRedditCallback(err);
            if (warn)
                consoleLib.warn(warn);

            var elapsed = new Date() - startTime;
            var timeToWait = 0;
            if (config.minTimeForRequest > elapsed)
                timeToWait = config.minTimeForRequest - elapsed;

            consoleLib.debug('Waiting ' + timeToWait + 'ms after request...');

            return setTimeout(function() {
                try {
                    var postsData = JSON.parse(body);
                }
                catch (err) {
                    return subRedditCallback(err);
                }

                var keptPostCount = 0;
                for (var i = 0 ; postsData.data.children.length > i ; ++i) {
                    var post = postsData.data.children[i].data;

                    if ((config.allowSelfPost && post.is_self) ||
                        (config.allowBannedPost && post.banned_by)) // If text post or banned post, skip
                        continue ;
                    else if (config.minScore > post.score || config.minUpsPercentage > post.ups * 100 / post.score) // If score too low, skip
                        continue ;

                    var found = false;
                    for (var j = 0 ; config.urlsToSkip.length > j ; ++j) {
                        if (new RegExp(config.urlsToSkip[j], 'i').test(post.url)) {
                            found = true;
                            break ;
                        }
                    }

                    if (found)
                        continue ;

                    ++keptPostCount;
                    postsToKeep.push(post);
                }

                consoleLib.info('Kept ' + keptPostCount + ' posts from /r/' + subReddit);
                return subRedditCallback();
            }, timeToWait);
        });
    },
    function(err) {
        if (err)
            return scriptCallback(err);

        consoleLib.log('Kept ' + postsToKeep.length + ' post from Reddit');
        consoleLib.log('Potentially saving ' + postsToKeep.length + ' post from Reddit');

        var reallyCreatedCount = 0;
        return asyncLib.eachSeries(postsToKeep, function(post, postCallback) {
            return mongooseLib.model('FetchedLink').findOneAndUpdate({
                source: 'reddit',
                subSource: post.subreddit,

                externalId: post.id
            },
            {
                $setOnInsert: {
                    source: 'reddit',
                    subSource: post.subreddit,

                    text: post.title,
                    url: post.url,
                    externalId: post.id,

                    postDate: new Date(post.created_utc * 1000),
                    postExpiryDate: tomorrow(),

                    created: new Date(),        
                },
            },
            {
                new: false,
                upsert: true,
            },
            function(err, oldDoc) {
                if (err)
                    return postCallback(err);

                if (!oldDoc)
                    ++reallyCreatedCount;

                return postCallback();
            });
        },
        function(err) {
            if (err)
                return scriptCallback(err);

            consoleLib.log(reallyCreatedCount + ' post from Reddit really saved on ' + postsToKeep.length);

            return scriptCallback();
        });
    });
};

exports.execute = execute;
