'use strict';

var pathLib = require('path');
var sassLib = require('node-sass');

var consoleLib = require(__dirname + '/../../lib/console');
var constantsLib = require(__dirname + '/../../lib/constants');
var sessionLib = require(__dirname + '/../../lib/session');
var utilsLib = require(__dirname + '/../../lib/utils');

var init_ = function (serverApp) {
    serverApp.set('views', constantsLib.backViewPath);
    serverApp.engine('html', require('ejs').renderFile);

    var checkLoggedIn = function(req, res, next) {
        if (req.session && req.session.login)
            return next();

        if (!req.session) req.session = {};
        if (!req.session.redirectFrom) {
            if (!/\/login/.test(req.originalUrl))
                req.session.redirectFrom = req.originalUrl;
        }

        return res.redirect('/login');
    };
    var checkIsAdmin = function(req, res, next) {
        if (!req.session || 'admin' != req.session.rights) {
            sessionLib.pushMessage(res, 'danger', 'Not enough privileges to perform this action.');
            return res.redirect('/403');
        }

        return next();
    };

    var simpleGet = function(req, res, file) {
        if (!res.locals)
            res.locals = {};
        res.locals.inlineStyles = [];

        return res.sendfile(constantsLib.backViewPath + '/' + file);
    };
    var scssGet = function(req, res, file) {
        if (!res.locals)
            res.locals = {};
        res.locals.inlineStyles = [];

        var paths = {
            file:       constantsLib.backViewPath + '/' + file,
            includes:   [pathLib.resolve(__dirname + '/../views/css/')],
        };

        return sassLib.render({
            file: paths.file,
            outputStyle: 'compressed',
            includePaths: paths.includes,
            success: function(css) {
                res.set('Content-Type', 'text/css');
                return res.send(css);
            },
            error: function(err) {
                consoleLib.error(err);
                return res.send(500, {});
            },
        });
    };

    var pagesEngine = require(__dirname + '/../_pages');

    var loginController = new (require(__dirname + '/login').Controller)();

    var articlesController = new (require(__dirname + '/articles').Controller)();
    var databaseController = new (require(__dirname + '/database').Controller)();
    var logController = new (require(__dirname + '/log').Controller)();
    var memosController = new (require(__dirname + '/memos').Controller)();
    var shareController = new (require(__dirname + '/share').Controller)();
    var reportsController = new (require(__dirname + '/reports').Controller)();
    var statisticsController = new (require(__dirname + '/statistics').Controller)();
    var usersController = new (require(__dirname + '/users').Controller)();

    var errorController = new (require(__dirname + '/error').Controller)();

    serverApp.get('/', checkLoggedIn, function(req, res) { return pagesEngine.render({content: statisticsController.render}, req, res); });
    serverApp.get('/statistics', checkLoggedIn, function(req, res) { return pagesEngine.render({content: statisticsController.render}, req, res); });

    serverApp.get('/articles', checkLoggedIn, function(req, res) { return pagesEngine.render({content: articlesController.render}, req, res); });
    serverApp.get('/article/edit/:technicalName?', checkLoggedIn, function(req, res) { return pagesEngine.render({content: articlesController.renderEdit}, req, res); });

    serverApp.get('/memos', checkLoggedIn, function(req, res) { return pagesEngine.render({content: memosController.render}, req, res); });
    serverApp.post('/memos/new', checkLoggedIn, function(req, res) { return pagesEngine.post({content: memosController.createNew}, req, res); });
    serverApp.post('/memos/remove', checkLoggedIn, function(req, res) { return pagesEngine.post({content: memosController.remove}, req, res); });
    serverApp.post('/memos/addItem', checkLoggedIn, function(req, res) { return pagesEngine.post({content: memosController.addItem}, req, res); });
    serverApp.post('/memos/removeItem', checkLoggedIn, function(req, res) { return pagesEngine.post({content: memosController.removeItem}, req, res); });

    serverApp.get('/users/:page?', checkLoggedIn, function(req, res) { return pagesEngine.render({content: usersController.render}, req, res); });

    serverApp.get('/reports', checkLoggedIn, function(req, res) { return pagesEngine.render({content: reportsController.render}, req, res); });
    serverApp.post('/reports/change-state', checkLoggedIn, checkIsAdmin, function(req, res) { return pagesEngine.post({content: reportsController.changeState}, req, res); });

    serverApp.get('/share', checkLoggedIn, function(req, res) { return pagesEngine.render({content: shareController.render}, req, res); });
    serverApp.post('/share/remove', checkLoggedIn, function(req, res) { return pagesEngine.post({content: shareController.remove}, req, res); });

    serverApp.get('/database', checkLoggedIn, function(req, res) { return pagesEngine.render({content: databaseController.render}, req, res); });

    serverApp.get('/log', checkLoggedIn, function(req, res) { return pagesEngine.render({content: logController.render}, req, res); });
    serverApp.get('/log/update/:lineNumber', checkLoggedIn, function(req, res) { return pagesEngine.ajax({content: logController.ajax}, req, res); });

    serverApp.get('/login', function(req, res) { return pagesEngine.render({content: loginController.render}, req, res); });
    serverApp.post('/login', function(req, res) { return pagesEngine.post({post: loginController.login}, req, res); });
    serverApp.post('/logout', function(req, res) { return pagesEngine.post({post: loginController.logout}, req, res); });

    serverApp.get('/favicon', function (req, res) { return simpleGet(req, res, 'img/Pmp-BO.ico'); });

    serverApp.get('/css/:file', function (req, res) { return scssGet(req, res, 'css/' + req.params.file + '.scss'); });

    serverApp.get('/js/:file', function (req, res) { return simpleGet(req, res, 'js/' + req.params.file + '.js'); });

    serverApp.get('/img/:file', function (req, res) { return simpleGet(req, res, 'img/' + req.params.file + '.png'); });

    serverApp.get('/fonts/:file', function (req, res) { return simpleGet(req, res, 'fonts/' + req.params.file); });

    serverApp.get('/humans', function (req, res) { return res.redirect('/humans.txt'); });
    serverApp.get('/humans.txt', function (req, res) { return simpleGet(req, res, 'humans.txt'); });
    serverApp.get('/robots', function (req, res) { return res.redirect('/robots.txt'); });
    serverApp.get('/robots.txt', function (req, res) { return simpleGet(req, res, 'robots.txt'); });

    serverApp.get('/js/*', function (req, res) { res.writeHead(404, {}); return res.end(); });
    serverApp.get('/css/*', function (req, res) { res.writeHead(404, {}); return res.end(); });
    serverApp.get('/img/*', function (req, res) { res.writeHead(404, {}); return res.end(); });
    serverApp.get('/fonts/*', function (req, res) { res.writeHead(404, {}); return res.end(); });

    serverApp.get('/403', function (req, res) { return pagesEngine.render({content: errorController.render403}, req, res); });
    serverApp.get('/404', function (req, res) { return pagesEngine.render({content: errorController.render404}, req, res); });
    serverApp.get('/500', function (req, res) { return pagesEngine.render({content: errorController.render500}, req, res); });
    serverApp.get('/501', function (req, res) { return pagesEngine.render({content: errorController.render501}, req, res); });

    serverApp.get('*', function (req, res) { return pagesEngine.render({content: errorController.render404}, req, res); });
    serverApp.post('*', function (req, res) { return pagesEngine.render({content: errorController.render404}, req, res); });

    serverApp.use(function(err, req, res, next) {
        if (err) {
            consoleLib.error(err.stack);
            consoleLib.error(err.message);
            consoleLib.error(err);
            return pagesEngine.render({content: errorController.render500}, req, res);
        }

        return next();
    });
};

exports.init = init_;
