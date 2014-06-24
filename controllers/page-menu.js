var asyncLib = require('async');
var mongooseLib = require('mongoose');

var utilsLib = require(__dirname + '/../lib/utils');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
        return renderCallback();
    };
};

exports.Controller = controller_;
