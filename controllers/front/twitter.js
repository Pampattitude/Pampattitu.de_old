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
            var latestTweet = null;
            var latestTweetLink = 'http://twitter.com/Pampattitude';

            if (err || !tweets.length)
                sessionLib.pushMessage(res, 'warning', 'Could not get latest tweet.');
            else {
                latestTweet = tweets[0].text; //.replace(/(http[s]?:\/\/[^ ]+)/g, '<u>$1</u>').replace(/#([0-9A-Za-z\-_]+)/g, '<i>#$1</i>');
                latestTweetLink = 'https://twitter.com/' + tweets[0].user.screen_name + '/status/' + tweets[0].id_str;
            }

            return ajaxCallback(null, {latestTweet: latestTweet, latestTweetLink: latestTweetLink});
        });
    };
};

exports.Controller = controller_;
