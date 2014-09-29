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

        res.locals.title = 'about:Curriculum Vitae';
        res.locals.contentPath = 'pages/front/cv';

        return renderCallback();
    };

    this.renderRaw = function(req, res, renderCallback) {
        res.locals.title= 'C.V. - Guillaume &laquo; Pampa &raquo; Delahodde';
        res.locals.app = 'front';
        res.locals.view = 'raw';

        return res.render(__dirname + '/../../views/pages/front/cv.ejs');
    };
};

exports.Controller = controller_;
