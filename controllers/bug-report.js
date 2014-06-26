'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../lib/console');
var utilsLib = require(__dirname + '/../lib/utils');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
        res.locals.contentPath = 'pages/bug-report/content.ejs';

        return renderCallback();
    };
};

exports.Controller = controller_;
