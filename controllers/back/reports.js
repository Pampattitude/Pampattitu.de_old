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

        var lastWeek = function() {
            var nw = new Date();
            nw.setDate(nw.getDate() - 7);
            return nw;
        };

        return mongooseLib.model('Report').find({$or: [{state: {$in: ['open', 'inProgress']}}, {updated: {$gte: lastWeek()}}]}).sort({created: 1}).exec(function(err, reports) {
            if (err) {
                consoleLib.error(err);
                return renderCallback(err);
            }

            res.locals.reportList = reports;

            res.locals.title = 'Reports';
            res.locals.contentPath = 'pages/back/reports';

            return renderCallback();
        });
    };

    this.changeState = function(req, res, postCallback) {
        var id = req.body.id;

        if (!id) {
            sessionLib.pushMessage(req, 'danger', 'Missing report ID.');
            return postCallback(new Error('Missing report ID from form'));
        }

        var newState = null;
        if ('undefined' !== typeof req.body.stateOpen) newState = 'open';
        if ('undefined' !== typeof req.body.stateInProgress) newState = 'inProgress';
        if ('undefined' !== typeof req.body.stateClosed) newState = 'closed';

        if (!newState) {
            sessionLib.pushMessage(req, 'danger', 'Unknown report state for selected report.');
            return postCallback(new Error('Unknown report state'));
        }

        return mongooseLib.model('Report').update({_id: id}, {$set: {state: newState, updated: new Date()}}, function(err) {
            if (err) {
                sessionLib.pushMessage(req, 'danger', 'Unknown error while updating report.');
                return postCallback(err);
            }

            return postCallback();
        });
    };
};

exports.Controller = controller_;
