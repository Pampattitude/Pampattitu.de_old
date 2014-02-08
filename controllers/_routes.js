var pathLib = require('path');

var consoleLib = require('../lib/console');
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

    var pagesEngine = require('./_pages.js');

    var homeController = new (require('./home.js').Controller)();
    var articleController = new (require('./article.js').Controller)();
    var userController = new (require('./user.js').Controller)();
    var errorController = new (require('./error.js').Controller)();

    serverApp.get('/', function(req, res) { return pagesEngine.render({content: homeController.render}, req, res); });
    serverApp.get('/home', function(req, res) { return pagesEngine.render({content: homeController.render}, req, res); });

    serverApp.get('/articles/:page?', function(req, res) { return pagesEngine.render({content: articleController.renderList}, req, res); });
    serverApp.get('/article/:technicalName', function(req, res) { return pagesEngine.render({content: articleController.render}, req, res); });

    serverApp.post('/login', function(req, res) { return pagesEngine.post({post: userController.login}, req, res); });
    serverApp.post('/logout', function(req, res) { return pagesEngine.post({post: userController.logout}, req, res); });

    serverApp.get('/favicon', function (req, res) {
	return simpleGet(req, res, 'img/Pmp.ico');
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
	return pagesEngine.render({content: errorController.render404}, req, res);
    });

    serverApp.get('*', function (req, res) {
	return pagesEngine.render({content: errorController.render404}, req, res);
    });
    serverApp.post('*', function (req, res) {
	return pagesEngine.render({content: errorController.render404}, req, res);
    });
};

exports.init = init_;
