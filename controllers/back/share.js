'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../../lib/console');
var sessionLib = require(__dirname + '/../../lib/session');
var utilsLib = require(__dirname + '/../../lib/utils');

var commonBack = require(__dirname + '/common');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
        commonBack.setCommonFields(res);

        return mongooseLib.model('FetchedLink').find({state: 'new'}).sort({postDate: 1}).exec(function(err, links) {
            if (err)
                return renderCallback(err);

            res.locals.linkList = links;

            res.locals.title = 'Share';
            res.locals.contentPath = 'pages/back/share';

            return renderCallback();
        });
    };

    this.remove = function(req, res, postCallback) {
        if (!req.body.id || !req.body.id.length) {
            sessionLib.pushMessage('Missing memo ID.');
            return postCallback(new Error('Missing or empty memo ID'));
        }

        return mongooseLib.model('FetchedLink').update({_id: req.body.id}, {$set: {state: 'treated'}}, function(err, link) {
            if (err)
                return postCallback(err);
            if (!link)
                sessionLib.pushMessage(req, 'warning', 'Could not find given link.');
            else
                sessionLib.pushMessage(req, 'success', 'Link removed!');
            return postCallback();
        });
    };
};

exports.Controller = controller_;
