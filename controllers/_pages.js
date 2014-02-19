var asyncLib = require('async');

var consoleLib = require(__dirname + '/../lib/console');
var constantsLib = require(__dirname + '/../lib/constants');
var sessionLib = require(__dirname + '/../lib/session');
var utilsLib = require(__dirname + '/../lib/utils');

var render_ = function(modules, req, res) {
    res.locals.rights = req.session.rights;
    res.locals.inlineStyles = [];
    res.locals.previousPage = req.session.previousPage;
    if (req.session.login)
	res.locals.login = req.session.login;
    if (req.session.alerts) {
	res.locals.alerts = req.session.alerts;
	req.session.alerts = [];
    }
    if (req.session.previousFormData) {
	res.locals.previousFormData = req.session.previousFormData;
	req.session.previousFormData = [];
    }

    // Add default site menu data
    if (!modules.siteMenu) {
        var siteMenuController = new (require('./site-menu.js').Controller)();
        modules.siteMenu = siteMenuController.render;
    }
    // Add default site menu data
    if (!modules.pageMenu) {
        var pageMenuController = new (require('./page-menu.js').Controller)();
        modules.pageMenu = pageMenuController.render;
    }
    // Add default site menu data
    if (!modules.buttonMenu) {
        var buttonMenuController = new (require('./button-menu.js').Controller)();
        modules.buttonMenu = buttonMenuController.render;
    }

    return asyncLib.each(utilsLib.objectToArray(modules), function(fct, callback) {
        return fct(req, res, callback);
    },
    function(err) {
        if (err) {
            consoleLib.error(err);
            return res.redirect('/404');
        }

	req.session.previousPage = req.path;
        return res.render(constantsLib.viewTemplateFull);
    });
};

var post_ = function(modules, req, res) {
    return asyncLib.each(utilsLib.objectToArray(modules), function(fct, callback) {
        return fct(req, res, callback);
    },
    function(err) {
        if (err) {
            consoleLib.error(err);
	    sessionLib.setPreviousFormData(req, req.body);
	    if (!req.session)
		return res.redirect('/home');
	    return res.redirect(req.session.redirectTo || req.session.previousPage || '/home');
        }

	if (!req.session)
	    return res.redirect('/home');
	return res.redirect(req.session.redirectTo || req.session.previousPage || '/home');
    });
};

var ajax_ = function(modules, req, res) {
    var resp = {};

    return asyncLib.each(utilsLib.objectToArray(modules), function(fct, callback) {
        return fct(req, res, function(err, data) {
            if (err)
                return callback(err);

            resp = utilsLib.mergeObjects(resp, data);
            return callback();
        });
    },
    function(err) {
        if (err) {
            consoleLib.error(err);
            return res.json(500, {text: err});
        }

        return res.json(200, resp);
    });
};

exports.render = render_;
exports.post = post_;
exports.ajax = ajax_;
