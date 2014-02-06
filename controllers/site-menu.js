var asyncLib = require('async');
var mongooseLib = require('mongoose');

var utilsLib = require(__dirname + '/../lib/utils');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
	var Article = mongooseLib.model('Article');

        return Article.find({}).sort({lastUpdated: 1}).limit(3).exec(function(err, articles) {
	    if (err)
	        return renderCallback(err);

	    res.locals.latestArticleList = articles;
	    return renderCallback();
        });
    };
};

exports.Controller = controller_;
