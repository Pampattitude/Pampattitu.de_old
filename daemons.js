var consoleLib = require(__dirname + '/lib/console');

var execute = function() {
    var calculateTagsScript = require(__dirname + '/scripts/calculateTags');

    var calculateTagsDaemon = function() {
	return calculateTagsScript.execute(function(err) {
	    if (err)
		consoleLib.error(err);

	    var waitTime = 10 * 60 * 1000; // Every 10 minutes

	    return setTimeout(function() {
		return calculateTagsDaemon();
	    }, waitTime);
	});
    };

    calculateTagsDaemon();

    return ;
};

exports.execute = execute;
