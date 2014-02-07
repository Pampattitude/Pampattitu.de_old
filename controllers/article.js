var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../lib/console');
var utilsLib = require(__dirname + '/../lib/utils');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
	var Article = mongooseLib.model('Article');
        var articlesModel = require('../models/articles.js');

	var technicalName = req.params.technicalName;

	return Article.findOne({technicalName: technicalName}, function(err, article) {
	    if (err)
		return renderCallback(err);
	    else if (!article)
		return renderCallback('Could not find article ' + technicalName);

	    res.locals.article = article;
	    res.locals.inlineStyles.push('article');
	    res.locals.contentPath = 'pages/article/content.ejs';

            return renderCallback();
	});
    };
};

exports.Controller = controller_;
