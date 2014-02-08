var mongooseLib = require('mongoose');

var schemaOptions = {
    autoIndex: true,
};

var schema = new mongooseLib.Schema({
    login: {type: String, required: true, index: true, unique: true},
    password: {type: String, default: ''}, // Commentors do not have to be registered

    rights: {type: Number, default: 0, enum: [0, 1, 2, 3, 4]},
}, schemaOptions);

exports.model = mongooseLib.model('User', schema);

/*
  Rights:
  0 -> reader / commentor / guest
  1 -> registered user
  2 -> priviledged user
  3 -> ?placeholder?
  4 -> admin
*/
