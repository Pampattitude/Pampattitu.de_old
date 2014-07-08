'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require('../lib/console');
var databaseLib = require('../lib/database');

var databaseUri = 'mongodb://localhost/pmp-home';

mongooseLib.connect(databaseUri);
mongooseLib.connection.on('error', function (err) {
    // Handle error
    consoleLib.error('Could not open DB connection: ' + err);

    mongooseLib.connection.close();
    mongooseLib.connect(databaseUri);
});
mongooseLib.connection.once('open', function () {
    // Handle open;
    return databaseLib.getModelsAndCollections(function(err, list) {
        if (err) {
            consoleLib.error(err);
            return process.exit(1);
        }

        consoleLib.log(list);
        return process.exit(0);
    });
});
