'use strict';

var clusterLib = require('cluster');
var expressLib = require('express');
var helmetLib = require('helmet');
var mongooseLib = require('mongoose');
var requireDirLib = require('require-dir');

var consoleLib = require(__dirname + '/lib/console');
var constantsLib = require(__dirname + '/lib/constants');

if (clusterLib.isMaster) {
    var clusterCount = 1; // Single cluster count

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

    global.processId = 'Master';

    mongooseLib.connect(constantsLib.databaseUri);
    mongooseLib.connection.on('error', function (err) {
        // Handle error
        consoleLib.error('Could not open DB connection: ' + err);

        mongooseLib.connection.close();
        mongooseLib.connect(constantsLib.databaseUri);
    });
    mongooseLib.connection.once('open', function () {
        // Handle open;
        consoleLib.log('DB connection open');
        requireDirLib(__dirname + '/models/');
        consoleLib.log('Collections sync\'ed');

        if (mongooseLib.connection.collections['sessions']) {
            return mongooseLib.connection.collections['sessions'].drop(function(err) {
                if (err) {
                    consoleLib.error(err);
                    return process.exit(1);
                }

                consoleLib.info('Sessions dropped');

                require(__dirname + '/scripts/back/daemons').execute();
                return ;
            });
        }

        require(__dirname + '/scripts/back/daemons').execute();
        return ;
    });
}
else {
    global.processId = 'Worker ' + clusterLib.worker.id;

    mongooseLib.connect(constantsLib.databaseUri);
    mongooseLib.connection.on('error', function (err) {
        // Handle error
        consoleLib.error('Could not open DB connection: ' + err);

        mongooseLib.connection.close();
        mongooseLib.connect(constantsLib.databaseUri);
    });
    mongooseLib.connection.once('open', function () {
        // Handle open;
        consoleLib.log('DB connection open');
        requireDirLib(__dirname + '/models/');
        consoleLib.log('Collections sync\'ed');
    });

    var app = expressLib();
    app.configure(function() {
        app.disable('x-powered-by');

        if ('debug' == process.env.NODE_ENV)
            app.use(expressLib.errorHandler({ dumpExceptions: true, showStack: true }));
        app.use(expressLib.logger('dev'));

        // Security headers
        app.use(helmetLib.xframe());
        app.use(helmetLib.xssFilter());
        app.use(helmetLib.nosniff());
        app.use(helmetLib.nocache());

        app.use(expressLib.bodyParser());
        app.use(expressLib.methodOverride());

        var mongoStore = require('connect-mongo')(expressLib);
        app.use(expressLib.cookieParser());
        app.use(expressLib.session({
            store: new mongoStore ({
                url: constantsLib.databaseUri + '/sessions'
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

        require(__dirname + '/controllers/back/_routes').init(app);
        app.use(app.router);
        app.enable('jsonp callback');
    });

    var server = app.listen(7338);
}
