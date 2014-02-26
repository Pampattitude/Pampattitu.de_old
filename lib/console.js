var winstonLib = require('winston');

var utilsLib = require('./utils');

var log = function() {
    return winstonLib.info(utilsLib.traceCaller(1) + ': ' + Array.prototype.slice.call(arguments).join(' '));
};

var info = function() {
    return winstonLib.info(utilsLib.traceCaller(1) + ': ' + Array.prototype.slice.call(arguments).join(' '));
};

var debug = function() {
    return winstonLib.debug(utilsLib.traceCaller(1) + ': ' + Array.prototype.slice.call(arguments).join(' '));
};

var warn = function() {
    return winstonLib.warn(utilsLib.traceCaller(1) + ': ' + Array.prototype.slice.call(arguments).join(' '));
};

var error = function() {
    return winstonLib.error(utilsLib.traceCaller(1) + ': ' + Array.prototype.slice.call(arguments).join(' '));
};

exports.log =   log;
exports.info =  info;
exports.debug = debug;
exports.warn =  warn;
exports.error = error;

winstonLib.remove(winstonLib.transports.Console);
winstonLib.add(winstonLib.transports.Console, {level: 'silly', prettyPrint: true, colorize: true, timestamp: true});
