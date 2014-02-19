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

	mongooseLib.connection.close();
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

var app = expressLib();

app.configure(function() {
    app.use(expressLib.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(expressLib.logger('dev'));

    app.use(expressLib.bodyParser());
    app.use(expressLib.methodOverride());

    var mongoStore = require('connect-mongo')(expressLib);
    app.use(expressLib.cookieParser());
    app.use(expressLib.session({
        store: new mongoStore ({
            url: databaseUri + '/sessions'
        },
        function() {
            consoleLib.info("MongoStore connected!");
        }),
        secret: '7iGofFxdVeCafeq35BDrOdoV',
    }));

    app.use(function(req, res, next) {
	if (!req.params)  req.params = {};
	if (!req.body)    req.body = {};
	if (!req.session) req.session = {};
	if (!res.locals)  res.locals = {};
	return next();
    });

    require('./controllers/_routes.js').init(app);
    app.use(app.router);
    app.enable('jsonp callback');
});

var server = app.listen(7337);
