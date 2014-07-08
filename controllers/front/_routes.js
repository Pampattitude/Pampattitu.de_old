'use strict';

var pathLib = require('path');
var sassLib = require('node-sass');

var consoleLib = require(__dirname + '/../../lib/console');
var constantsLib = require(__dirname + '/../../lib/constants');
var utilsLib = require(__dirname + '/../../lib/utils');

var init_ = function (serverApp) {
    serverApp.set('views', constantsLib.frontViewPath);
    serverApp.engine('html', require('ejs').renderFile);

    var simpleGet = function(req, res, file) {
        if (!res.locals)
            res.locals = {};
        res.locals.inlineStyles = [];

        return res.sendfile(constantsLib.frontViewPath + '/' + file);
    };
    var scssGet = function(req, res, file) {
        if (!res.locals)
            res.locals = {};
        res.locals.inlineStyles = [];

        var paths = {
            file:       constantsLib.frontViewPath + '/' + file,
            includes:   [pathLib.resolve(__dirname + '/../../views/css/')],
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

    var homeController = new (require(__dirname + '/home').Controller)();
    var articleController = new (require(__dirname + '/article').Controller)();
    var searchController = new (require(__dirname + '/search').Controller)();
    var userController = new (require(__dirname + '/user').Controller)();
    var errorController = new (require(__dirname + '/error').Controller)();
    var reportController = new (require(__dirname + '/report').Controller)();

    serverApp.get('/', function(req, res) { return pagesEngine.render({content: homeController.render}, req, res); });
    serverApp.get('/home', function(req, res) { return pagesEngine.render({content: homeController.render}, req, res); });

    serverApp.get('/articles/:page?', function(req, res) { return pagesEngine.render({content: articleController.renderList}, req, res); });
    serverApp.get('/article/edit/:technicalName?', function(req, res) { return pagesEngine.render({content: articleController.renderEdit}, req, res); });
    serverApp.get('/article/:technicalName', function(req, res) { return pagesEngine.render({content: articleController.render}, req, res); });
    serverApp.post('/article/edit', function(req, res) { return pagesEngine.post({content: articleController.edit}, req, res); });
    serverApp.post('/article/addComment', function(req, res) { return pagesEngine.post({content: articleController.addComment}, req, res); });
    serverApp.get('/random-article', function(req, res) { return pagesEngine.render({content: articleController.renderMagic}, req, res); });
    serverApp.get('/user/:login', function(req, res) { return pagesEngine.render({content: userController.render}, req, res); });
    serverApp.get('/search/:data?/:page?', function(req, res) { return pagesEngine.render({content: searchController.render}, req, res); });
    serverApp.post('/search', function(req, res) { return pagesEngine.post({content: searchController.post}, req, res); });

    serverApp.get('/report', function(req, res) { return pagesEngine.render({content: reportController.render}, req, res); });
    serverApp.post('/report/submit', function(req, res) { return pagesEngine.post({post: reportController.submit}, req, res); });

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
