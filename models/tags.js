var mongooseLib = require('mongoose');

var schema = new mongooseLib.Schema({
    name: {type: String, required: true},
    count: {type: Number, default: 0},
    hype: {type: Number, default: 0},

    created: {type: Date, default: new Date()}
});

exports.model = mongooseLib.model('Tag', schema);
