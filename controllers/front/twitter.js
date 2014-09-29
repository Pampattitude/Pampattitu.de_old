'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../../lib/console');
var utilsLib = require(__dirname + '/../../lib/utils');

var commonFront = require(__dirname + '/common');

var controller_ = function() {
    this.getLatestTweet = function(req, res, ajaxCallback) {
        // Twitter
        var ntwitterLib = require('ntwitter');

        var twitter = ntwitterLib({
            consumer_key: 'KzSKT35SjnVQgb5pAbQkyUqpm',
            consumer_secret: 'Uz1GEbVYcA1YLrYSknoLzXXeZQKAjr8OG92YweDfVGrFySo3cw',
            access_token_key: '361897142-gy85An1rs40REQahBAjLA6uoTRoyQ3taHLANsNqS',
            access_token_secret: '6vme2Q77BZrIwUeXrWBzg9v9MRyPuq3kuMhPEOmpBbzbo',
        });
        return twitter.get('/statuses/user_timeline.json', {screen_name: 'Pampattitude', count: 5}, function(err, tweets) {
            var latestTweets = [];

            if (err || !tweets.length)
                sessionLib.pushMessage(res, 'warning', 'Could not get latest tweet.');
            else {
                for (var i = 0 ; tweets.length > i ; ++i) {
                    var tweet = tweets[i];
                    latestTweets.push({
                        text: tweet.text, //.replace(/(http[s]?:\/\/[^ ]+)/g, '<u>$1</u>').replace(/#([0-9A-Za-z\-_]+)/g, '<i>#$1</i>'),
                        link: 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
                    });
                }
            }

            return ajaxCallback(null, {latestTweets: latestTweets});
        });
    };
};

exports.Controller = controller_;
