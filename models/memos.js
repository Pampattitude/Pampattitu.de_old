'use strict';

var mongooseLib = require('mongoose');

var schemaOptions = {
    autoIndex: true,
};

var schema = new mongooseLib.Schema({
    title: {type: String, required: true},
    content: [{text: {type: String}}],

    created: {type: Date, default: Date.now},
}, schemaOptions);

exports.model = mongooseLib.model('Memo', schema);
