var mongooseLib = require('mongoose');

var schemaOptions = {
    autoIndex: true,
};

var schema = new mongooseLib.Schema({
    login: {type: String, required: true, index: true, unique: true},
    password: {type: String, default: ''}, // Commentors do not have to be registered
    pictureUrl: {type: String},
    description: {type: String},

    rights: {type: String, default: 'guest', enum: ['guest', 'registered', 'priviledged', 'admin']},
}, schemaOptions);

exports.model = mongooseLib.model('User', schema);
