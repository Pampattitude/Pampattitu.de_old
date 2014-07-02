'use strict';

var mongooseLib = require('mongoose');

var schemaOptions = {
    autoIndex: true,
};

var tomorrow = function() { var date = new Date(); date.setDate(date.getDate() + 1); return date; };

var schema = new mongooseLib.Schema({
    content: {type: String, required: true},
    author: {type: String, required: true},

    created: {type: Date, default: Date.now},
    expiry: {type: Date, default: tomorrow, index: true},
}, schemaOptions);

exports.model = mongooseLib.model('Bulletin', schema);
