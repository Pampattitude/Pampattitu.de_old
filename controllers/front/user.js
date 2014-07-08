'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../../lib/console');
var sessionLib = require(__dirname + '/../../lib/session');
var utilsLib = require(__dirname + '/../../lib/utils');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
        var User = mongooseLib.model('User');

        var login = req.params.login;

        return User.findOne({login: login}, function(err, user) {
            if (err)
                return renderCallback(err);
            else if (!user)
                return renderCallback('Could not find user ' + login);

            res.locals.user = user;
            // res.locals.inlineStyles.push('user');
            res.locals.contentPath = 'pages/user/content';

            return renderCallback();
        });
    };

    this.login = function(req, res, loginCallback) {
        if (!req.body.login)
            return loginCallback(new Error('Missing login'));
        // Password is not mandatory
        req.body.password = req.body.password || '';

        return mongooseLib.model('User').findOne({login: req.body.login}, function(err, user) {
            if (err) {
                sessionLib.pushMessage(req, 'danger', 'An unknown error has occured, please contact an administrator.');
                return loginCallback(err);
            }
            else if (!user) {
                sessionLib.pushMessage(req, 'danger', 'Missing username.');
                return loginCallback(new Error('User ' + req.body.login + ' unknown'));
            }

            var pass = '';
            if (req.body.password.length) {
                var crypto = require('crypto');
                var shasum = crypto.createHash('sha1');

                shasum.update(req.body.password);
                pass = shasum.digest('hex');
            }

            if (user.password == pass) {
                req.session.login = req.body.login;
                req.session.rights = user.rights;
                sessionLib.pushMessage(req, 'success', 'Successfully logged in!');
                return loginCallback();
            }
            sessionLib.pushMessage(req, 'danger', 'Wrong username / password combination.');
            return loginCallback(new Error('Password does not match user ' + user.login));
        });
    };

    this.logout = function(req, res, logoutCallback) {
        delete req.session.login;
        delete req.session.rights;
        sessionLib.pushMessage(req, 'success', 'Successfully logged out!');
        return logoutCallback();
    };
};

exports.Controller = controller_;
