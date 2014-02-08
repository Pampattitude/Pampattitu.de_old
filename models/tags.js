var mongooseLib = require('mongoose');

var schemaOptions = {
    autoIndex: true,
};

var schema = new mongooseLib.Schema({
    name: {type: String, required: true, index: true, unique: true},
    count: {type: Number, default: 0, index: true},
    hype: {type: Number, default: 0, index: true},

    created: {type: Date, default: new Date()}
}, schemaOptions);

exports.model = mongooseLib.model('Tag', schema);
