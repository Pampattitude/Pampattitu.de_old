var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../lib/console');

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

    require(__dirname + '/../models/articles.js').model;
    require(__dirname + '/../models/tags.js').model;
    require(__dirname + '/../models/users.js').model;

    consoleLib.log('Collections sync\'ed');

    var Tag = require(__dirname + '/../models/tags.js').model;
    mongooseLib.connection.collections['tags'].drop();
    consoleLib.log('Emptied tags collection.');

    var tagList = [
	'this', 'is', 'a', 'test',
	'c++', 'cpp', 'boost', 'sfml', 'qt',
	'javascript', 'node.js', 'nodejs', 'node', 'js',
	'html', 'css',
	'python',
	'article', 'pmp', 'pampa', 'pampattitude',
    ];

    return asyncLib.each(tagList, function(tag, tagCallback) {
	var elem = new Tag({});

	elem.name = tag;
	elem.count = parseInt(Math.random() * 10);
	elem.hype = parseInt(Math.random() * 6000);

	elem.save(function(err) {
            if (err)
                return tagCallback(err);

	    consoleLib.log('Created new tag.');
            return tagCallback();
        });
    },
    function(err) {
        if (err) {
            consoleLib.error(err);
            return process.exit(1);
        }

        return process.exit(0);
    });
});
