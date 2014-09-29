'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../../lib/console');
var sessionLib = require(__dirname + '/../../lib/session');
var utilsLib = require(__dirname + '/../../lib/utils');

var commonBack = require(__dirname + '/common');

var controller_ = function() {
    var self = this;

    this.render = function(req, res, renderCallback) {
        commonBack.setCommonFields(res);

        res.locals.title = 'Login';
        res.locals.buttonMenu = 'pages/back/nobutton-menu';
        res.locals.contentPath = 'pages/back/login';

        return renderCallback();
    };

    this.login = function(req, res, loginCallback) {
        if (!req.body.username)
            return loginCallback(new Error('Missing login'));
        // Password is not mandatory
        req.body.password = req.body.password || '';

        return mongooseLib.model('User').findOne({login: req.body.username, rights: {$in: ['priviledged', 'admin']}}, function(err, user) {
            if (err) {
                sessionLib.pushMessage(req, 'danger', 'An unknown error has occured, please contact an administrator.');
                return loginCallback(err);
            }
            else if (!user) {
                sessionLib.pushMessage(req, 'danger', 'Unknown user or not enough priviledges.');
                return loginCallback(new Error('User ' + req.body.username + ' unknown'));
            }

            var pass = '';
            if (req.body.password.length) {
                var crypto = require('crypto');
                var shasum = crypto.createHash('sha1');

                shasum.update(req.body.password);
                pass = shasum.digest('hex');
            }

            if (user.password == pass) {
                req.session.login = req.body.username;
                req.session.rights = user.rights;
                sessionLib.pushMessage(req, 'success', 'Successfully logged in!');

                if (req.session.redirectFrom) {
                    req.session.redirectTo = req.session.redirectFrom;
                    delete req.session.redirectFrom;
                }
                else
                    req.session.redirectTo = '/';

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
