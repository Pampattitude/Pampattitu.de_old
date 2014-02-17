var mongooseLib = require('mongoose');

var consoleLib = require('../lib/console');

var databaseUri = 'mongodb://localhost/bmb-home';

mongooseLib.connect(databaseUri);
mongooseLib.connection.on('error', function (err) {
    // Handle error
    consoleLib.error('Could not open DB connection: ' + err);

    mongooseLib.close();
    mongooseLib.connect(databaseUri);
});
mongooseLib.connection.once('open', function () {
    // Handle open;
    consoleLib.log('DB connection open');

    require('./models/articles.js').model;
    require('./models/tags.js').model;
    require('./models/users.js').model;

    consoleLib.log('Collections sync\'ed');

    var Tag = require('../models/tags.js').model;
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

    for (var i = 0 ; tagList.length > i ; ++i) {
	var elem = new Tag({});

	elem.name = tagList[i];
	elem.count = parseInt(Math.random() * 10);
	elem.hype = parseInt(Math.random() * 6000);

	elem.save();
	consoleLib.log('Created new tag.');
    }
});
