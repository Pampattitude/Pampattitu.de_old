'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../../lib/console');
var utilsLib = require(__dirname + '/../../lib/utils');

var commonBack = require(__dirname + '/common');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
        commonBack.setCommonFields(res);

        return mongooseLib.model('Report').find({}).sort({created: 1}).exec(function(err, reports) {
            if (err) {
                consoleLib.error(err);
                return renderCallback(err);
            }

            res.locals.reportList = reports;

            res.locals.contentPath = 'pages/back/reports';

            return renderCallback();
        });
    };
};

exports.Controller = controller_;
