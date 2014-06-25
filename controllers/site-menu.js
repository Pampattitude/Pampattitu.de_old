'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var utilsLib = require(__dirname + '/../lib/utils');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
        var Article = mongooseLib.model('Article');
        var Tag = mongooseLib.model('Tag');

        res.locals.inlineScripts.push('/js/pmp.loginForm');

        return asyncLib.series([
            function(serieCallback) {
                return Article.find({}).sort({lastUpdated: -1}).limit(3).exec(function(err, articles) {
                    if (err)
                        return serieCallback(err);

                    res.locals.latestArticleList = articles;
                    return serieCallback();
                });
            },
            function(serieCallback) {
                return Article.find({}).sort({views: -1}).limit(3).exec(function(err, articles) {
                    if (err)
                        return serieCallback(err);

                    res.locals.hypestArticleList = articles;
                    return serieCallback();
                });
            },
            function(serieCallback) {
                return Tag.find({}).sort({points: -1}).limit(10).exec(function(err, tags) {
                    if (err)
                        return serieCallback(err);

                    res.locals.mostUsedTagList = tags;
                    return serieCallback();
                });
            },
        ],
        function(err) {
            if (err)
                return renderCallback(err);

            return renderCallback();
        });
    };
};

exports.Controller = controller_;
