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
/*
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
*/
	var pointsForTitle =   15;
	var pointsForCaption = 3;
	var pointsForContent = 1;
	var pointsForTag =     10;
	var pointsForView =    0.05;

	var data = (req.params.data ? req.params.data.split(' ') : []);
	var page = req.params.page;

	var finalArticleList = [];
	return mongooseLib.model('Article').find({}).exec(function(err, articleList) {
	    if (err)
		return renderCallback(err);

	    return asyncLib.eachSeries(articleList, function(article, articleCallback) {
		article.points = 0;
		var dataCopy = data.slice(0);

		var tagGroupRegex = '(';

		for (var j = 0 ; dataCopy.length > j ; ++j) {
		    dataCopy[j] = utilsLib.escapeRegExp(dataCopy[j].trim());

		    tagGroupRegex += dataCopy[j];
		    if (dataCopy.length > j + 1)
			tagGroupRegex += '|';

		    for (var i = 0 ; article.tags.length > i ; ++i) {
			if (article.tags[i].match(new RegExp('(' + dataCopy[j] + ')', 'gi'))) {
			    article.points += pointsForTag;
			}
		    }
		}
		tagGroupRegex += ')';

		var tagSearch = new RegExp(tagGroupRegex, 'gi');
		var titleMatch = article.title.match(tagSearch);
		var captionMatch = article.caption.match(tagSearch);
		var contentMatch = article.content.match(tagSearch);
		article.points += (titleMatch ? titleMatch.length - 1 : 0) * pointsForTitle;
		article.points += (captionMatch ? captionMatch.length - 1 : 0) * pointsForCaption;
		article.points += (contentMatch ? contentMatch.length - 1 : 0) * pointsForContent;

		if (article.points)
		    article.points += article.views * pointsForView;

		article.points = parseInt(article.points);
		consoleLib.debug('Article "' + article.title + '" has ' + article.points + ' points for search "' + req.params.data + '"');

		if (article.points)
		    finalArticleList.push(article);
		return articleCallback();
	    },
	    function(err) {
		if (err)
		    return renderCallback(err);

		finalArticleList.sort(function(a, b) { return b.points - a.points; });

		res.locals.articleList = finalArticleList.slice(offset, offset + articlesPerPage);
		res.locals.pageCount = finalArticleList.length / articlesPerPage;
		res.locals.actualPage = pageNumber;
		res.locals.searchString = req.params.data;
		// res.locals.inlineStyles.push('search');
		res.locals.contentPath = 'pages/search/content.ejs';

		return renderCallback();
	    });
	});
    };

    this.post = function(req, res, postCallback) {
	sessionLib.setRedirection(req, '/search/' + (req.body.data || ''));
	return postCallback();
    };
};

exports.Controller = controller_;
