'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../../lib/console');
var sessionLib = require(__dirname + '/../../lib/session');
var utilsLib = require(__dirname + '/../../lib/utils');

var commonFront = require(__dirname + '/common');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
        commonFront.setCommonFields(res);

        var User = mongooseLib.model('User');

        var login = req.params.login;

        return User.findOne({login: login}, function(err, user) {
            if (err)
                return renderCallback(err);
            else if (!user)
                return renderCallback('Could not find user ' + login);

            res.locals.user = user;

            res.locals.title = 'about:' + user.login;
            res.locals.contentPath = 'pages/front/user';

            return renderCallback();
        });
    };
};

exports.Controller = controller_;
