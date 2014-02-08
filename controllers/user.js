var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../lib/console');
var utilsLib = require(__dirname + '/../lib/utils');

var controller_ = function() {
    this.login = function(req, res, loginCallback) {
	if (!req.body.login)
	    return loginCallback(new Error('Missing login'));
	else if (!req.body.password)
	    return loginCallback(new Error('Missing password'));

	return mongooseLib.model('User').findOne({login: req.body.login}, function(err, user) {
	    if (err)
		return loginCallback(err);
	    else if (!user)
		return loginCallback(new Error('User ' + req.body.login + ' unknown'));

	    var crypto = require('crypto');
	    var shasum = crypto.createHash('sha1');

	    shasum.update(req.body.password);
	    var pass = shasum.digest('hex');

	    if (user.password == pass) {
		req.session.login = req.body.login;
		req.session.rights = user.rights;
		return loginCallback();
	    }
	    return loginCallback(new Error('Password does not match user ' + user.login));
	});
    };

    this.logout = function(req, res, logoutCallback) {
	req.session.destroy();
	return logoutCallback();
    };
};

exports.Controller = controller_;
