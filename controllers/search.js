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
	var pointsForTitle =   8;
	var pointsForCaption = 3;
	var pointsForContent = 1;
	var pointsForTag =     5;

	var data = (req.params.data ? req.params.data.split(' ') : []);
	var page = req.params.page;
	return mongooseLib.model('Article').find({}).exec(function(err, articleList) {
	    if (err)
		return renderCallback(err);

	    return asyncLib.eachSeries(articleList, function(article, articleCallback) {
		article.points = 0;

		for (var j = 0 ; data.length > j ; ++j) {
		    for (var i = 0 ; article.tags.length > i ; ++i) {
			if (data[j] == article.tags[i]) {
			    article.points += pointsForTag;
			}
		    }

		    console.log('points before ' + article.points);
		    var tagSearch = new RegExp('(' + data[j] + ')', 'i');
		    var titleMatch = article.title.match(tagSearch);
		    var captionMatch = article.caption.match(tagSearch);
		    var contentMatch = article.content.match(tagSearch);
		    article.points += (titleMatch ? titleMatch.length - 1 : 0) * pointsForTitle;
		    console.log('points after title ' + article.points);
		    article.points += (captionMatch ? captionMatch.length - 1 : 0) * pointsForCaption;
		    console.log('points after caption ' + article.points);
		    article.points += (contentMatch ? contentMatch.length - 1 : 0) * pointsForContent;
		    console.log('points after content ' + article.points);
		}

		consoleLib.debug('Article "' + article.title + '" has ' + article.points + ' points');

		return articleCallback();
	    },
	    function(err) {
		if (err)
		    return renderCallback(err);

		articleList.sort(function(a, b) { return b.points - a.points; });

		res.locals.articleList = articleList.slice(offset, offset + articlesPerPage);
		res.locals.pageCount = articleList.length / articlesPerPage;
		res.locals.actualPage = pageNumber;
		res.locals.searchString = req.params.data;
		// res.locals.inlineStyles.push('search');
		res.locals.contentPath = 'pages/search/content.ejs';

		return renderCallback();
	    });
	});
    };
};

exports.Controller = controller_;
