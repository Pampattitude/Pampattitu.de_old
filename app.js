var httpLib = require('http');
var expressLib = require('express');
var urlLib = require('url');

var fsLib = require('fs');

var ejsLib = require('ejs');
var jsonLib = require('JSON');

var clusterLib = require('cluster');

var mongooseLib = require('mongoose');
var databaseUri = 'mongodb://localhost/bmb-home';

var winstonLib = require('winston');
winstonLib.remove(winstonLib.transports.Console);
winstonLib.add(winstonLib.transports.Console, {level: 'silly', prettyPrint: true, colorize: true, timestamp: true});

var consoleLib = require(__dirname + '/lib/console');

if (clusterLib.isMaster) {
    var cluserPerCpu = 1;
    var clusterCount = parseInt(require('os').cpus().length * cluserPerCpu) || 1;

    clusterLib.on('fork', function(worker) {
	consoleLib.info('Worker ' + worker.id + ' created');
    });
    clusterLib.on('exit', function (worker) {
	consoleLib.warn('Worker ' + worker.id + ' died, forking a new one');
	clusterLib.fork();
    });

    for (var i = 0 ; i < clusterCount ; ++i) {
        clusterLib.fork();
    }

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

	require(__dirname + '/models/articles').model;
	require(__dirname + '/models/comments').model;
	require(__dirname + '/models/tags').model;
	require(__dirname + '/models/users').model;

	consoleLib.log('Collections sync\'ed');

	require(__dirname + '/daemons').execute();
    });
}
else {
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

	require(__dirname + '/models/articles').model;
	require(__dirname + '/models/comments').model;
	require(__dirname + '/models/tags').model;
	require(__dirname + '/models/users').model;

	consoleLib.log('Collections sync\'ed');
    });

    var app = expressLib();
    app.configure(function() {
	app.disable('x-powered-by');

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

	require(__dirname + '/controllers/_routes.js').init(app);
	app.use(app.router);
	app.enable('jsonp callback');
    });

    var server = app.listen(7337);
}
