'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../../lib/console');
var utilsLib = require(__dirname + '/../../lib/utils');

var commonFront = require(__dirname + '/common');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
        commonFront.setCommonFields(res);

        var Article = mongooseLib.model('Article');
        var articlesModel = require(__dirname + '/../../models/articles.js');

        return asyncLib.series([
            function(serieCallback) {
                return articlesModel.getFeatured(function(err, featured) {
                    if (err)
                        return serieCallback(err);

                    res.locals.featuredArticle = featured;
                    return serieCallback();
                })
            },
            function(serieCallback) {
                var findOpts = {};
                if (res.locals.featuredArticle)
                    findOpts._id = {$ne: res.locals.featuredArticle.id};

                return Article.find(findOpts).sort({lastUpdated: -1}).limit(4).exec(function(err, articles) {
                    if (err)
                        return serieCallback(err);

                    var featuredCount = 0;
                    for (var i = 0 ; articles.length > i ; ++i) {
                        var article = articles[i];
                        if (true === article.featured)
                            ++featuredCount;
                    }

                    res.locals.articleList = articles;
                    // res.locals.inlineStyles.push('home');

                    return serieCallback();
                });
            },
        ],
        function(err) {
            res.locals.contentPath = 'pages/home/content';

            if (err) {
                consoleLib.error(err);
                return renderCallback(err);
            }

            return renderCallback();
        });
    };
};

exports.Controller = controller_;
