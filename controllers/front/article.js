'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../../lib/console');
var sessionLib = require(__dirname + '/../../lib/session');
var utilsLib = require(__dirname + '/../../lib/utils');

var commonFront = require(__dirname + '/common');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
        commonFront.setCommonFields(res);

        var Article = mongooseLib.model('Article');
        var Comment = mongooseLib.model('Comment');
        var articlesModel = require(__dirname + '/../../models/articles');

        var technicalName = req.params.technicalName;

        return Article.getByTechnicalName(technicalName, function(err, article) {
            if (err)
                return renderCallback(err);
            else if (!article)
                return renderCallback('Could not find article ' + technicalName);

            ++article.views;
            return article.save(function(err) {
                if (err)
                    return renderCallback(err);

                return Comment.find({articleId: article._id}, function(err, comments) {
                    if (err)
                        return renderCallback(err);
                    else if (!comments)
                        return renderCallback('Could not find comments for article ' + technicalName);

                    res.locals.article = article;
                    res.locals.comments = comments;
                    // res.locals.inlineStyles.push('article');
                    res.locals.contentPath = 'pages/article/content';

                    return renderCallback();
                });
            });
        });
    };

    this.renderList = function(req, res, renderCallback) {
        commonFront.setCommonFields(res);

        var Article = mongooseLib.model('Article');
        var articlesModel = require(__dirname + '/../../models/articles');

        var articlesPerPage = 3;

        var pageNumber = ((req.params.page - 1) >= 0) ? (req.params.page - 1) : 0;
        var offset = (pageNumber || 0) * articlesPerPage;

        return Article.find({}).sort({lastUpdated: -1}).exec(function(err, articleList) {
            if (err)
                return renderCallback(err);

            res.locals.articleList = articleList.slice(offset, offset + articlesPerPage);
            res.locals.pageCount = articleList.length / articlesPerPage;
            res.locals.actualPage = pageNumber;
            // res.locals.inlineStyles.push('articles');
            res.locals.contentPath = 'pages/articles/content';

            return renderCallback();
        });
    };

    this.renderMagic = function(req, res, renderCallback) {
        commonFront.setCommonFields(res);

        var Article = mongooseLib.model('Article');
        var articlesModel = require(__dirname + '/../../models/articles');

        return Article.find({}, function(err, articles) {
            if (err)
                return renderCallback(err);
            else if (!articles || !articles.length)
                return renderCallback('Could not find an article');

            return res.redirect('/article/' + articles[Math.floor(Math.random() * articles.length)].technicalName);
        });
    };

    this.renderEdit = function(req, res, renderCallback) {
        commonFront.setCommonFields(res);

        var Article = mongooseLib.model('Article');
        var articlesModel = require(__dirname + '/../../models/articles');

        var technicalName = req.params.technicalName;

        if (!technicalName) {
            // res.locals.inlineStyles.push('article');
            res.locals.contentPath = 'pages/article/edit';

            return renderCallback();
        }

        return Article.getByTechnicalName(technicalName, function(err, article) {
            if (err)
                return renderCallback(err);
            else if (!article)
                return renderCallback('Could not find article ' + technicalName);

            res.locals.article = article;
            // res.locals.inlineStyles.push('article');
            res.locals.contentPath = 'pages/article/edit.ejs';

            return renderCallback();
        });
    };

    this.edit = function(req, res, editCallback) {
        if (!req.session.rights)
            return editCallback(new Error('Not enough priviledges'));

        var Article = mongooseLib.model('Article');
        var articlesModel = require(__dirname + '/../../models/articles');

        if (!req.body.title ||
            !req.session.login ||
            !req.body.caption ||
            !req.body.content) {
            sessionLib.pushMessage(req, 'danger', 'Invalid form.');
            return editCallback(new Error('Bad form'));
        }

        var data = {
            title: utilsLib.cleanHtmlInput(req.body.title.toString().trim()),
            author: req.session.login,
            img: req.body.imageUrl,
            caption: utilsLib.cleanHtmlInput(req.body.caption.toString().trim()),
            content: utilsLib.cleanHtmlInput(req.body.content.toString().trim()),
        };
        if (req.body.tags && req.body.tags.length)
            data.tags = req.body.tags.trim().split(' ');

        if (req.body.id) {
            return Article.update({_id: req.body.id}, {$set: data}, function(err, hasData) {
                if (err) {
                    sessionLib.pushMessage(req, 'danger', 'An unknown error occured, please contact an administrator.');
                    return editCallback(err);
                }
                if (!hasData) {
                    consoleLib.warn('No data has been modified');
                    sessionLib.pushMessage(req, 'warning', 'No data has been modified.');
                    return editCallback();
                }

                sessionLib.pushMessage(req, 'success', 'Article edited!');

                Article.findOne({_id: req.body.id}, function(err, article) {
                    if (err) {
                        sessionLib.pushMessage(req, 'danger', 'An unknown error occured, please contact an administrator.');
                        return editCallback(err);
                    }

                    sessionLib.setRedirection(req, '/article/' + article.technicalName);
                    return editCallback();
                });
            });
        }
        else {
            data.technicalName = (req.body.title.toLowerCase().trim() + '_' + new Date().getFullYear() + '_' + (new Date().getMonth() + 1) + '_' + new Date().getDate()).trim().replace(/\s/, '_');
            return Article.create(data, function(err, article) {
                if (err) {
                    sessionLib.pushMessage(req, 'danger', 'An unknown error occured, please contact an administrator.');
                    return editCallback(err);
                }
                if (!article) {
                    consoleLib.warn('No data has been modified');
                    sessionLib.pushMessage(req, 'warning', 'No data has been modified.');
                    return editCallback();
                }

                sessionLib.pushMessage(req, 'success', 'Article edited!');
                sessionLib.setRedirection(req, '/article/' + article.technicalName);
                return editCallback();
            });
        }
    };

    this.addComment = function(req, res, addCallback) {
        var articleId = req.body.articleId;
        var commentText = req.body.commentText;

        if (!articleId || !commentText) {
            sessionLib.pushMessage(req, 'danger', 'Missing data in form.');
            return addCallback(new Error('Wrong comment form'));
        }
        var author = req.session.login;
        var authorAlias = req.body.authorAlias;

        var commentDoc = {
            articleId: articleId,
            content: utilsLib.cleanHtmlInput(commentText.trim()),
        };
        if (author)
            commentDoc.author = author;
        if (authorAlias)
            commentDoc.authorAlias = authorAlias;

        return mongooseLib.model('Comment').create(commentDoc, function(err) {
            if (err) {
                sessionLib.pushMessage(req, 'danger', 'An unknown error occured, please contact an administrator.');
                return addCallback(err);
            }

            sessionLib.pushMessage(req, 'success', 'Comment added!');
            return addCallback();
        });
    };
};

exports.Controller = controller_;
