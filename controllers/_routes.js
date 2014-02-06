var pathLib = require('path');

var constantsLib = require('../lib/constants');
var utilsLib = require('../lib/utils');

var init_ = function (serverApp) {
    serverApp.set('views', constantsLib.viewPath);
    serverApp.engine('html', require('ejs').renderFile);

    var simpleGet = function (req, res, file) {
	if (!res.locals)
	    res.locals = {};
	res.locals.inlineStyles = [];

	return res.sendfile(constantsLib.viewPath + '/' + file);
    };

    var errorGet = function (req, res, errorCode) {
	if (!res.locals)
	    res.locals = {};
	res.locals.inlineStyles = [];
	res.locals.contentPath = 'views/' + errorCode + '.ejs';

	return res.render(constantsLib.viewTemplate, res, function (err, data) {
	    res.writeHead(200, {'Content-Type': 'text/html'});
	    return res.end(data);
	});
    };

    var pagesEngine = require('./_pages.js');

    var homeController = new (require('./home.js').Controller)();

    serverApp.get('/', function(req, res) { return pagesEngine.render({content: homeController.render}, req, res); });
    serverApp.get('/home', function(req, res) { return pagesEngine.render({content: homeController.render}, req, res); });

    serverApp.get('/favicon', function (req, res) {
	return simpleGet(req, res, 'img/favicon.ico');
    });

    serverApp.get('/css/bootstrap', function (req, res) {
	return simpleGet(req, res, 'css/bootstrap.min.css');
    });
    serverApp.get('/css/icomoon', function (req, res) {
	return simpleGet(req, res, 'css/icomoon.css');
    });

    serverApp.get('/js/jquery', function (req, res) {
	return simpleGet(req, res, 'js/jquery.js');
    });
    serverApp.get('/js/bootstrap', function (req, res) {
	return simpleGet(req, res, 'js/bootstrap.min.js');
    });

    serverApp.get('/img/:file', function (req, res) {
	return simpleGet(req, res, 'img/' + req.params.file + '.png');
    });

    serverApp.get('/fonts/:file', function (req, res) {
	return simpleGet(req, res, 'fonts/' + req.params.file);
    });

    serverApp.get('/humans', function (req, res) {
	return res.redirect('/humans.txt');
    });
    serverApp.get('/humans.txt', function (req, res) {
	return simpleGet(req, res, 'humans.txt');
    });
    serverApp.get('/robots', function (req, res) {
	return res.redirect('/robots.txt');
    });
    serverApp.get('/robots.txt', function (req, res) {
	return simpleGet(req, res, 'robots.txt');
    });


    serverApp.get('/js/*', function (req, res) {
	res.writeHead(404, {});
	return res.end();
    });
    serverApp.get('/css/*', function (req, res) {
	res.writeHead(404, {});
	return res.end();
    });
    serverApp.get('/img/*', function (req, res) {
	res.writeHead(404, {});
	return res.end();
    });
    serverApp.get('/fonts/*', function (req, res) {
	res.writeHead(404, {});
	return res.end();
    });

    serverApp.get('/404', function (req, res) {
	return errorGet(req, res, 404);
    });

    serverApp.get('*', function (req, res) {
	return errorGet(req, res, 404);
    });
    serverApp.post('*', function (req, res) {
	return errorGet(req, res, 404);
    });
};

exports.init = init_;
