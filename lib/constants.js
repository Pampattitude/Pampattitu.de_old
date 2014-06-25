'use strict';

var pathLib = require('path');

var define = function(propName, propValue) {
    return Object.defineProperty(exports, propName, {
        value:          propValue,
        enumerable:     true,
        writable:       false,
    });
};

define('viewTemplate', 'layout.html');
define('viewPath', pathLib.resolve(__dirname + '/../views'));
define('viewTemplateFull', exports.viewPath + '/' + exports.viewTemplate);

define('jQueryPath', 'https://code.jquery.com/jquery-2.1.0.min.js');
