var httpLib = require('http');
var expressLib = require('express');
var urlLib = require('url');

var fsLib = require('fs');

var ejsLib = require('ejs');
var jsonLib = require('JSON');

var winstonLib = require('winston');
winstonLib.remove(winstonLib.transports.Console);
winstonLib.add(winstonLib.transports.Console, {level: 'silly', prettyPrint: true, colorize: true, timestamp: true});

var mongooseLib = require('mongoose');

var consoleLib = require('./lib/console');

var databaseUri = 'mongodb://localhost/bmb-home';

mongooseLib.connect(databaseUri);
mongooseLib.connection.on('error', function (err) {
	// Handle error
	consoleLib.error('Could not open DB connection: ' + err);

	mongooseLib.close();
	mongooseLib.connect(databaseUri);
});
mongooseLib.connection.once('open', function () {
	// Handle open;
	consoleLib.log('DB connection open');

	require('./models/articles.js').model;
	require('./models/tags.js').model;
	require('./models/users.js').model;

	consoleLib.log('Collections sync\'ed');
});

var serverApp = expressLib();

serverApp.configure(function() {
    serverApp.use(expressLib.errorHandler({ dumpExceptions: true, showStack: true }));
    serverApp.use(expressLib.logger('dev'));

    serverApp.use(expressLib.bodyParser());
    serverApp.use(expressLib.methodOverride());

    serverApp.use(expressLib.cookieParser());
    serverApp.use(expressLib.session({secret: '7iGofFxdVeCafeq35BDrOdoV'}));

    serverApp.use(function(req, res, next) {
	if (!req.params)  req.params = {};
	if (!req.body)    req.body = {};
	if (!req.session) req.session = {};
	if (!res.locals)  res.locals = {};
	return next();
    });

    require('./controllers/_routes.js').init(serverApp);
    serverApp.use(serverApp.router);
    serverApp.enable('jsonp callback');
});

serverApp.listen(7337);
