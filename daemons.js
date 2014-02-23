var execute = function() {
    var calculateTagsScript = require(__dirname + '/scripts/calculateTags');

    var calculateTagsDaemon = function() {
	var waitTime = 10 * 60 * 1000; // Every 10 minutes

	return setTimeout(function() {
	    calculateTagsScript.execute(function(err) {
		if (err)
		    consoleLib.error(err);

		return calculateTagsDaemon();
	    });
	}, waitTime);
    };

    calculateTagsDaemon();

    return ;
};

exports.execute = execute;
