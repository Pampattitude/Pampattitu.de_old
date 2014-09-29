'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../../lib/console');
var utilsLib = require(__dirname + '/../../lib/utils');

var commonBack = require(__dirname + '/common');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
        commonBack.setCommonFields(res);

        return mongooseLib.model('Article').find({}, {content: 0}).sort({created: -1}).exec(function(err, articles) {
            if (err)
                return renderCallback(err);

            for (var i = 0 ; articles.length > i ; ++i) {
                if (true == articles[i].featured) {
                    articles.unshift(articles.splice(i, 1)[0]);
                    break ;
                }
            }
            res.locals.articleList = articles;

            res.locals.title = 'Articles';
            res.locals.contentPath = 'pages/back/articles';

            return renderCallback();
        });
    };

    this.renderEdit = function(req, res, renderCallback) {
        commonBack.setCommonFields(res);

        var done = false;
        return asyncLib.until(function() { return done; }, function(articleCallback) {
            if (!req.params.technicalName) {
                done = true;
                return articleCallback();
            }

            return mongooseLib.model('Article').findOne({technicalName: req.params.technicalName}, function(err, article) {
                if (err)
                    return articleCallback(err);
                if (!article)
                    return articleCallback(new Error('Could not find article "' + req.params.technicalName + '"'));

                res.locals.article = article;
                done = true;

                return articleCallback();
            });
        },
        function(err) {
            if (err)
                return renderCallback(err);

            return mongooseLib.model('Memo').find({}, function(err, memos) {
                if (err)
                    return renderCallback(err);

                res.locals.memoList = memos;
                res.locals.contentPath = 'pages/back/articleEdit';

                return renderCallback();
            });
        });
    };
};

exports.Controller = controller_;
