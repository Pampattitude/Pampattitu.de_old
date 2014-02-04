var asyncLib = require('async');
var mongooseLib = require('mongoose');

var _controller = function() {
    var template = 'index.html';

    this.render = function(req, res) {
	var Article = mongooseLib.model('Article');

	return asyncLib.parallel([
	    function(callback) {
		return Article.find({}).limit(5).exec(function(err, articles) {
		    if (err)
			return callback(err);

		    res.locals.articleList = articles;
		    return callback();
		});
	    },
	    function(callback) {
		return Article.find({}).sort({lastUpdated: 1}).limit(3).exec(function(err, articles) {
		    if (err)
			return callback(err);

		    res.locals.latestArticleList = articles;
		    return callback();
		});
	    }
	],
	function(err) {
	    if (err) {
		console.log(err);
		res.writeHead(500, {'Content-Type': 'text/plain'});
		return res.end(data);
	    }

	    res.locals.inlineStyles.push('home');
	    res.locals.contentPath = 'pages/home.ejs';
	    return res.render(template, res, function (err, data) {
		if (err) {
		    console.log(err);
		    res.writeHead(500, {'Content-Type': 'text/plain'});
		    return res.end(data);
		}

		res.writeHead(200, {'Content-Type': 'text/html'});
		return res.end(data);
	    });
	});
    };
};

exports.Controller = _controller;
