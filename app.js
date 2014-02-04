var httpLib = require('http');
var expressLib = require('express');
var urlLib = require('url');

var fsLib = require('fs');

var ejsLib = require('ejs');
var jsonLib = require('JSON');

var mongooseLib = require('mongoose');

var databaseUri = 'mongodb://localhost/bmb-home';

mongooseLib.connect(databaseUri);
mongooseLib.connection.on('error', function (err) {
	// Handle error
	console.error('Could not open DB connection: ' + err);

	mongooseLib.close();
	mongooseLib.connect(databaseUri);
});
mongooseLib.connection.once('open', function () {
	// Handle open;
	console.log('DB connection open');

	require('./models/articles.js').model;
	require('./scripts/createArticle.js');
	console.log('Collections sync\'ed');
});

var serverApp = expressLib();

require('./controllers/_routes.js').init(serverApp);
serverApp.use(serverApp.router);

serverApp.listen(7337);
