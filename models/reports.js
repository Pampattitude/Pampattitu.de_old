'use strict';

var mongooseLib = require('mongoose');

var schemaOptions = {
    autoIndex: true,
};

var schema = new mongooseLib.Schema({
    author: {type: String, index: true},
    type: {type: String, index: true},
    content: {type: String, required: true},

    created: {type: Date, default: Date.now},
});

exports.model = mongooseLib.model('Report', schema);
