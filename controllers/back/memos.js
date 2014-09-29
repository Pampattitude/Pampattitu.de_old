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

        return mongooseLib.model('Memo').find({}).sort({_id: 1}).exec(function(err, memos) {
            if (err)
                return renderCallback(err);

            res.locals.memoList = memos;

            res.locals.title = 'Memos';
            res.locals.contentPath = 'pages/back/memos';

            return renderCallback();
        });
    };

    this.createNew = function(req, res, postCallback) {
        if (!req.body.title || !req.body.title.length) {
            sessionLib.pushMessage('Missing or empty title.');
            return postCallback(new Error('Missing or empty title'));
        }

        var memo = new (mongooseLib.model('Memo'))({
            title: req.body.title,
        });

        return memo.save(function(err) {
            return postCallback(err);
        });
    };

    this.remove = function(req, res, postCallback) {
        if (!req.body.id || !req.body.id.length) {
            sessionLib.pushMessage('Missing memo ID.');
            return postCallback(new Error('Missing or empty memo ID'));
        }

        return mongooseLib.model('Memo').remove({_id: req.body.id}, function(err) {
            return postCallback(err);
        });
    };

    this.addItem = function(req, res, postCallback) {
        if (!req.body.id || !req.body.id.length) {
            sessionLib.pushMessage('Missing memo ID.');
            return postCallback(new Error('Missing or empty memo ID'));
        }
        if (!req.body.item || !req.body.item.length) {
            sessionLib.pushMessage('Missing or empty item.');
            return postCallback(new Error('Missing or empty item'));
        }

        return mongooseLib.model('Memo').update({_id: req.body.id}, {$push: {content: {text: req.body.item}}}, function(err) {
            return postCallback(err);
        });
    };

    this.removeItem = function(req, res, postCallback) {
        if (!req.body.id || !req.body.id.length) {
            sessionLib.pushMessage('Missing memo ID.');
            return postCallback(new Error('Missing or empty memo ID'));
        }
        if (!req.body.itemId || !req.body.itemId.length) {
            sessionLib.pushMessage('Missing item index.');
            return postCallback(new Error('Missing or empty item index'));
        }

        return mongooseLib.model('Memo').update({_id: req.body.id}, {$pull: {content: {_id: req.body.itemId}}}, function(err) {
            return postCallback(err);
        });
    };
};

exports.Controller = controller_;
