var consoleLib = require(__dirname + '/lib/console');

var execute = function() {
    var calculateTagsScript = require(__dirname + '/scripts/calculateTags');
    var calculateTagsDaemon = function() {
	var waitTime = 10 * 60 * 1000; // Every 10 minutes

	return calculateTagsScript.execute(function(err) {
	    if (err)
		consoleLib.error(err);

	    return setTimeout(function() {
		return calculateTagsDaemon();
	    }, waitTime);
	});
    };

    var removeOldTagsScript = require(__dirname + '/scripts/removeOldTags');
    var removeOldTagsDaemon = function() {
	var waitTime = 10 * 60 * 1000; // Every 10 minutes

	return removeOldTagsScript.execute(function(err) {
	    if (err)
		consoleLib.error(err);

	    return setTimeout(function() {
		return removeOldTagsDaemon();
	    }, waitTime);
	});
    };

    calculateTagsDaemon();
    removeOldTagsDaemon();

    return ;
};

exports.execute = execute;
