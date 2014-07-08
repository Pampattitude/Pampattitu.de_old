'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../../lib/console');
var utilsLib = require(__dirname + '/../../lib/utils');

var controller_ = function() {
    var self = this;

    this.render_ = function(req, res, errorCode, renderCallback) {
        // res.locals.inlineStyles.push('error');
        res.locals.contentPath = 'pages/error/' + errorCode;

        return renderCallback();
    };

    this.render403 = function(req, res, renderCallback) { return self.render_(req, res, '403', renderCallback); };
    this.render404 = function(req, res, renderCallback) { return self.render_(req, res, '404', renderCallback); };
    this.render500 = function(req, res, renderCallback) { return self.render_(req, res, '500', renderCallback); };
    this.render501 = function(req, res, renderCallback) { return self.render_(req, res, '501', renderCallback); };
};

exports.Controller = controller_;
