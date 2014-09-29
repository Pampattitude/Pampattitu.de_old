var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../../lib/console');

var FetchedLink = require(__dirname + '/../../models/fetchedLinks').model;

var execute = function(scriptCallback) {
    consoleLib.info('Removing obsolete fetched links');

    return mongooseLib.model('FetchedLink').update({postExpiryDate: {$lte: new Date()}}, {$set: {state: 'obsolete'}}, {multi: true}, function(err, updatedCount) {
        if (err)
            return scriptCallback(err);

        consoleLib.info(updatedCount + ' obsolete fetched links removed');
        return scriptCallback();
    });
};

exports.execute = execute;
