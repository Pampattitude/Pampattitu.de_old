var mongooseLib = require('mongoose');
var consoleLib = require(__dirname + '/../lib/console');

var execute = function(scriptCallback) {
    consoleLib.info('Old tags deletion started');

    var minDate = new Date();
    minDate.setHours(minDate.getHours() - 1);

    return mongooseLib.model('Tag').remove({updated: {$lte: minDate}}).exec(function(err, count) {
	if (err)
	    return scriptCallback(err);

	consoleLib.info('Removed ' + count + ' old tags');
    });
};

exports.execute = execute;
