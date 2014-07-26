'use strict';

var mongooseLib = require('mongoose');

var tomorrow = function() {
    var tom = new Date();
    tom.setDate(tom.getDate() + 1);
    return tom;
};

var schemaOptions = {
    autoIndex: true,
};

var schema = new mongooseLib.Schema({
    state: {type: String, required: true, enum: ['new', 'treated']},

    source: {type: String, required: true, enum: ['reddit']},
    subSource: {type: String, required: false},

    text: {type: String, required: true}, // Explanation on website (Reddit post title, Twitter tweet, etc.)
    url: {type: String, required: true}, // URL to external article
    externalId: {type: String}, // Optional ID to find it back

    postDate: {type: Date, default: Date.now},
    postExpiryDate: {type: Date, default: tomorrow},

    created: {type: Date, default: Date.now}, // When was it fetched
}, schemaOptions);

exports.model = mongooseLib.model('FetchedLink', schema);
