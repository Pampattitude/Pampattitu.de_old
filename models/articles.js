var mongooseLib = require('mongoose');

var schemaOptions = {
    autoIndex: true,
};

var schema = new mongooseLib.Schema({
    technicalName: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    img: {type: String},
    tags: {type: [String], default: [], index: true},
    caption: {type: String, required: true},
    content: {type: String, required: true},
    author: {type: String, required: true},

    views: {type: Number, default: 0, index: true},

    lastUpdated: {type: Date, default: Date.now, index: true},
    history: {
	type: [Date], default: [Date.now]
    },
    featured: {type: Boolean, default: false, sparse: true}
}, schemaOptions);

var getById = function (id, callback) {
    return exports.model.findOne({_id: id}, callback);
};

var getByTechnicalName = function (tName, callback) {
    return exports.model.findOne({technicalName: tName}, callback);
};

var findWithTags = function (tagList, callback) {
    return exports.model.find({tags: {$all: tagList}}, callback);
};
var findOneWithTags = function (tagList, callback) {
    return exports.model.findOne({tags: {$all: tagList}}, callback);
};

var getFeatured = function (callback) {
    return exports.model.find({featured: true}).sort({lastUpdated: -1}).limit(1).exec(function(err, res) {
        if (err)
            return callback(err);
        return callback(err, res[0]);
    });
};

var getLatest = function (limit, callback) {
    return exports.model.find({}).sort({lastUpdated: -1}).limit(limit).exec(callback);
};

exports.getById = getById;
schema.statics.getById = getById;

exports.getByTechnicalName = getByTechnicalName;
schema.statics.getByTechnicalName = getByTechnicalName;

exports.findWithTags = findWithTags;
schema.statics.findWithTags = findWithTags;

exports.findOneWithTags = findOneWithTags;
schema.statics.findOneWithTags = findOneWithTags;

exports.getFeatured = getFeatured;
schema.statics.getFeatured = getFeatured;

exports.getLatest = getLatest;
schema.statics.getLatest = getLatest;

exports.model = mongooseLib.model('Article', schema);
