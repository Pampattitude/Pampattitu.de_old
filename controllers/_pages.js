var asyncLib = require('async');

var constantsLib = require(__dirname + '/../lib/constants');
var utilsLib = require(__dirname + '/../lib/utils');

var render_ = function(modules, req, res) {
    if (!res.locals)
        res.locals = {};
    res.locals.privileges = 'user';
    res.locals.inlineStyles = [];

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

    return asyncLib.each(utilsLib.objectToArray(modules), function(fct, callback) {
        return fct(req, res, callback);
    },
    function(err) {
        if (err) {
            winston.error(__dirname + '/' + __basename + ': ' + err);
            return res.redirect('/404');
        }

        return res.render(constantsLib.viewTemplateFull);
    });
};

exports.render = render_;
