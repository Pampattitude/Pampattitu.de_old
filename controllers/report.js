'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../lib/console');
var sessionLib = require(__dirname + '/../lib/session');
var utilsLib = require(__dirname + '/../lib/utils');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
        res.locals.inlineScripts.push('/js/pmp.reportForm');
        res.locals.contentPath = 'pages/report/content.ejs';

        return renderCallback();
    };

    this.submit = function(req, res, renderCallback) {
        if (!req.body.author)
            req.body.author = 'Anonymous';

        if (!req.body.type) {
            sessionLib.pushMessage(req, 'danger', 'Missing report type.');
            return renderCallback(new Error('Missing report type'));
        }

        if (!req.body.content || !req.body.content.length) {
            sessionLib.pushMessage(req, 'danger', 'Missing report content.');
            return renderCallback(new Error('Missing report content'));
        }

        return mongooseLib.model('Report').create({
            author: req.body.author,
            type: req.body.type,
            content: req.body.content,
            created: new Date(),
        },
        function(err) {
            if (err) {
                sessionLib.pushMessage(req, 'danger', 'An unknown error has occured, please contact an administrator.');
                return renderCallback(err);
            }

            sessionLib.pushMessage(req, 'success', 'Thank you for the report!');
            return renderCallback();
        });
    };
};

exports.Controller = controller_;
