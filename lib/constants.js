'use strict';

var pathLib = require('path');

var define = function(propName, propValue) {
    return Object.defineProperty(exports, propName, {
        value:          propValue,
        enumerable:     true,
        writable:       false,
    });
};

define('frontViewTemplate', 'layout.html');
define('frontViewPath', pathLib.resolve(__dirname + '/../views'));
define('frontViewTemplateFull', exports.frontViewPath + '/' + exports.frontViewTemplate);

define('backViewTemplate', 'layout.html');
define('backViewPath', pathLib.resolve(__dirname + '/../views'));
define('backViewTemplateFull', exports.viewPath + '/' + exports.viewTemplate);

define('jQueryPath', 'https://code.jquery.com/jquery-2.1.0.min.js');
