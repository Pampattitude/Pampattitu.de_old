var mongooseLib = require('mongoose');

var schemaOptions = {
    autoIndex: true,
};

var schema = new mongooseLib.Schema({
    articleId: {type: mongooseLib.Schema.Types.ObjectId, required: true, index: true},
    author: {type: String, index: true},
    authorAlias: {type: String},
    content: {type: String, required: true},

    created: {type: Date, default: new Date()},
});

exports.model = mongooseLib.model('Comment', schema);
