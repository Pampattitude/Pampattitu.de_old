var mongooseLib = require('mongoose');

var schema = new mongooseLib.Schema({
    name: {type: String, required: true},
    count: {type: Number, default: 0},

    created: {type: Date, default: new Date().toISOString()}
});

exports = mongooseLib.model('Tag', schema);

var _model = mongooseLib.model('Tag');
exports._model = _model;
