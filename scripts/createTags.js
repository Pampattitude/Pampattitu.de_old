var mongooseLib = require('mongoose');

var consoleLib = require('../lib/console');

var Tag = require('../models/tags.js').model;
mongooseLib.connection.collections['tags'].drop();
consoleLib.log('Emptied tags collection.');

var tagList = ['this', 'is', 'a', 'test'];

for (var i = 0 ; tagList.length > i ; ++i) {
    var elem = new Tag({});

    elem.name = tagList[i];
    elem.count = parseInt(Math.random() * 10);
    elem.hype = parseInt(Math.random() * 6000);

    elem.save();
    consoleLib.log('Created new tag.');
}
