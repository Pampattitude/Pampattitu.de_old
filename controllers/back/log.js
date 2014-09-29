'use strict';

var asyncLib = require('async');
var childProcess = require('child_process');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../../lib/console');
var utilsLib = require(__dirname + '/../../lib/utils');

var commonBack = require(__dirname + '/common');

var controller_ = function() {
    var maxLineNumber = 256;
    var logPath = '/data/log/beta-website.log';

    this.render = function(req, res, renderCallback) {
        commonBack.setCommonFields(res);

        return childProcess.exec('tail -n ' + maxLineNumber + ' ' + logPath, function(err, tailStdout) {
            if (err)
                return renderCallback(err);

            return childProcess.exec('wc -l ' + logPath, function(err, wcStdout) {
                if (err)
                    return renderCallback(err);

                res.locals.lines = tailStdout;
                res.locals.lineNumber = parseInt(wcStdout, 10);

                res.locals.title = 'Logs';
                res.locals.contentPath = 'pages/back/log';

                return renderCallback();
            });
        });
    };

    this.ajax = function(req, res, ajaxCallback) {
        if (!req.params.lineNumber || 0 > req.params.lineNumber)
            return ajaxCallback(new Error('Missing line number'));

        return childProcess.exec('wc -l ' + logPath, function(err, wcStdout) {
            if (err)
                return ajaxCallback(err);

            var previousLineNumber = parseInt(req.params.lineNumber, 10);
            var lineNumber = parseInt(wcStdout, 10);

            if (0 > lineNumber - previousLineNumber)
                return ajaxCallback(new Error('Wrong line number given'));
            else if (0 == lineNumber)
                return ajaxCallback(null, {lines: '', lineNumber: previousLineNumber});

            return childProcess.exec('tail -n ' + (lineNumber - previousLineNumber) + ' /data/log/beta-website.log', function(err, tailStdout) {
                if (err)
                    return ajaxCallback(err);

                var lines = tailStdout;
                var newLineNumber = lineNumber + parseInt(tailStdout.split('\n').length - 1, 10);

                return ajaxCallback(null, {lines: lines, lineNumber: lineNumber});
            });
        });
    };
};

exports.Controller = controller_;
