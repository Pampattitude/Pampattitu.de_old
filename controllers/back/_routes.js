'use strict';

var pathLib = require('path');
var sassLib = require('node-sass');

var consoleLib = require(__dirname + '/../../lib/console');
var constantsLib = require(__dirname + '/../../lib/constants');
var utilsLib = require(__dirname + '/../../lib/utils');

var init_ = function (serverApp) {
    serverApp.set('views', constantsLib.backViewPath);
    serverApp.engine('html', require('ejs').renderFile);

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

    var errorController = new (require(__dirname + '/../error').Controller)();

    serverApp.get('/', function(req, res) { return pagesEngine.render({content: statisticsController.render}, req, res); });
    serverApp.get('/statistics', function(req, res) { return pagesEngine.render({content: statisticsController.render}, req, res); });

    serverApp.post('/login', function(req, res) { return pagesEngine.post({post: userController.login}, req, res); });
    serverApp.post('/logout', function(req, res) { return pagesEngine.post({post: userController.logout}, req, res); });

    serverApp.get('/favicon', function (req, res) { return simpleGet(req, res, 'img/Pmp.ico'); });

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
            consoleLib.error(err);
            return pagesEngine.render({content: errorController.render500}, req, res);
        }

        return next();
    });
};

exports.init = init_;
