'use strict';

var mongooseLib = require('mongoose');

var schemaOptions = {
    autoIndex: true,
};

var schema = new mongooseLib.Schema({
    author: {type: String, index: true},
    type: {type: String, index: true},
    content: {type: String, required: true},

    state: {type: String, default: 'open', enum: ['open', 'inProgress', 'closed']},

    created: {type: Date, default: Date.now},
    updated: {type: Date},
});

schema.pre('save', function(next) {
    this.updated = new Date();

    return next();
});

exports.model = mongooseLib.model('Report', schema);
