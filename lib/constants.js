var pathLib = require('path');

var define = function(propName, propValue) {
    return Object.defineProperty(exports, propName, {
        value:          propValue,
        enumerable:     true,
        writable:       false,
    });
};

define('viewTemplate', 'index.html');
define('viewPath', pathLib.resolve(__dirname + '/../views'));
define('viewTemplateFull', exports.viewPath + '/' + exports.viewTemplate);
