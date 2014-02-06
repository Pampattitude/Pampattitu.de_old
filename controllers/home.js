var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../lib/console');
var utilsLib = require(__dirname + '/../lib/utils');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
	var Article = mongooseLib.model('Article');

	return Article.find({}).limit(5).exec(function(err, articles) {
	    if (err) {
		consoleLib.error(err);
		return renderCallback(err);
	    }

	    res.locals.articleList = articles;
	    res.locals.inlineStyles.push('home');
	    res.locals.contentPath = 'pages/home.ejs';
            return renderCallback();
	});
    };
};

exports.Controller = controller_;
