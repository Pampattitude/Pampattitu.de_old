'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../../lib/console');
var utilsLib = require(__dirname + '/../../lib/utils');

var commonBack = require(__dirname + '/common');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
        commonBack.setCommonFields(res);

/*        var pageNumber = req.params.page || 0;
        var usersPerPage = 20;*/

        return mongooseLib.model('User').find({}).sort({login: 1})/*.skip(usersPerPage * pageNumber).limit(usersPerPage)*/.exec(function(err, users) {
            if (err) {
                consoleLib.error(err);
                return renderCallback(err);
            }

            res.locals.userList = users;

            res.locals.contentPath = 'pages/back/users';

            return renderCallback();
        });
    };
};

exports.Controller = controller_;
