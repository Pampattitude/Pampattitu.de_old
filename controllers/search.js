var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../lib/console');
var sessionLib = require(__dirname + '/../lib/session');
var utilsLib = require(__dirname + '/../lib/utils');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
	var articlesPerPage = 3;
	var pageNumber = ((req.params.page - 1) >= 0) ? (req.params.page - 1) : 0;
	var offset = (pageNumber || 0) * articlesPerPage;

	var data = (req.params.data ? req.params.data.split(' ') : []);
	var page = req.params.page;
	return mongooseLib.model('Article').find({tags: {$in: data}}).sort({views: -1}).exec(function(err, articleList) {
	    if (err)
		return renderCallback(err);

	    res.locals.articleList = articleList.slice(offset, offset + articlesPerPage);
	    res.locals.pageCount = articleList.length / articlesPerPage;
	    res.locals.actualPage = pageNumber;
	    res.locals.searchString = req.params.data;
	    // res.locals.inlineStyles.push('search');
	    res.locals.contentPath = 'pages/search/content.ejs';

	    return renderCallback();
	});
    };
};

exports.Controller = controller_;
