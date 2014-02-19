var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../lib/console');
var sessionLib = require(__dirname + '/../lib/session');
var utilsLib = require(__dirname + '/../lib/utils');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
	var Article = mongooseLib.model('Article');
	var articlesModel = require('../models/articles.js');

	var technicalName = req.params.technicalName;

	return Article.getByTechnicalName(technicalName, function(err, article) {
	    if (err)
		return renderCallback(err);
	    else if (!article)
		return renderCallback('Could not find article ' + technicalName);

	    res.locals.article = article;
	    // res.locals.inlineStyles.push('article');
	    res.locals.contentPath = 'pages/article/content.ejs';

            return renderCallback();
	});
    };

    this.renderList = function(req, res, renderCallback) {
	var Article = mongooseLib.model('Article');
	var articlesModel = require('../models/articles.js');

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
	    res.locals.contentPath = 'pages/articles/content.ejs';

            return renderCallback();
	});
    };

    this.renderMagic = function(req, res, renderCallback) {
	var Article = mongooseLib.model('Article');
	var articlesModel = require('../models/articles.js');

	return Article.find({}, function(err, articles) {
	    if (err)
		return renderCallback(err);
	    else if (!articles || !articles.length)
		return renderCallback('Could not find an article');

	    return res.redirect('/article/' + articles[Math.floor(Math.random() * articles.length)].technicalName);
	});
    };

    this.renderEdit = function(req, res, renderCallback) {
	var Article = mongooseLib.model('Article');
	var articlesModel = require('../models/articles.js');

	var technicalName = req.params.technicalName;

	if (!technicalName) {
	    // res.locals.inlineStyles.push('article');
	    res.locals.contentPath = 'pages/article/edit.ejs';

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
	var articlesModel = require('../models/articles.js');

        if (!req.body.title ||
            !req.session.login ||
            !req.body.imageUrl ||
            !req.body.tags ||
            !req.body.caption ||
            !req.body.content) {
	    sessionLib.pushMessage(req, 'danger', 'Invalid form.');
            return editCallback(new Error('Bad form'));
	}

        var data = {
            title: req.body.title.trim(),
            author: req.session.login,
            img: req.body.imageUrl,
            tags: req.body.tags.trim().split(' '),
            caption: req.body.caption.trim(),
            content: req.body.content.trim(),
        };
        var dbCallback = function(err, hasData) {
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
	    return editCallback();
        };

        if (req.body.id)
            return Article.update({_id: req.body.id}, {$set: data}, dbCallback);
        else {
            data.technicalName = (req.body.title.toLowerCase().trim() + '_' + new Date().getFullYear() + '_' + (new Date().getMonth() + 1) + '_' + new Date().getDate()).trim().replace(/\s/, '_');
            return Article.create(data, dbCallback);
        }
    };
};

exports.Controller = controller_;
