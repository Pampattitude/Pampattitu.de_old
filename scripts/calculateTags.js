'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');
var consoleLib = require(__dirname + '/../lib/console');

var execute = function(scriptCallback) {
    consoleLib.info('Calculating tags');

    return mongooseLib.model('Article').find().limit(1000).exec(function(err, articles) {
        if (err)
            return scriptCallback(err);

        consoleLib.info(articles.length + ' articles found');

        var Article = mongooseLib.model('Article');
        var Comment = mongooseLib.model('Comment');
        var Tag =     mongooseLib.model('Tag');

        var tags = {};
        return asyncLib.eachSeries(articles, function(article, articleCallback) {
            consoleLib.info('Working on article "' + article.title + '"');

            var viewCount = parseInt(article.views);
            var featuredCount = article.featured ? 1 : 0;

            return Comment.count({articleId: article._id}, function(err, commentCount) {
                if (err)
                    return articleCallback(err);

                consoleLib.info(commentCount + ' comments found for article "' + article.title + '"');

                var commentCount = commentCount;

                for (var i = 0 ; article.tags.length > i ; ++i) {
                    var tagName = article.tags[i];

                    if (!tags[tagName])
                        tags[tagName] = { articleCount: 0, viewCount: 0, featuredCount: 0, commentCount: 0 };

                    tags[tagName].articleCount +=  1;
                    tags[tagName].viewCount +=     viewCount;
                    tags[tagName].featuredCount += featuredCount;
                    tags[tagName].commentCount +=  commentCount;
                }

                return articleCallback();
            });
        },
        function(err) {
            if (err) {
                consoleLib.error(err);
                return ;
            }

            return asyncLib.eachSeries(Object.keys(tags), function(tag, tagCallback) {
                var tagData = {
                    $set: {
                        articleCount: tags[tag].articleCount,
                        viewCount: tags[tag].viewCount,
                        featuredCount: tags[tag].featuredCount,
                        commentCount: tags[tag].commentCount,
                    },
                };

                return Tag.update({name: tag}, tagData, {upsert: true}, function(err) {
                    if (err)
                        return tagCallback(err);

                    return Tag.findOne({name: tag}, function(err, tag) {
                        if (err)
                            return tagCallback(err);

                        tag.points = tag.articleCount * 10 +
                            tag.viewCount * 1 +
                            tag.featuredCount * 250 +
                            tag.commentCount * 25;
                        tag.updated = new Date();

                        return tag.save(function(err) {
                            if (err)
                                return tagCallback(err);

                            consoleLib.info('Tag "' + tag.name + '" saved with ' + tag.points + ' points');

                            return tagCallback();
                        });
                    });
                });
            },
            function(err) {
                return scriptCallback(err);
            });
        });
    });
};

exports.execute = execute;
