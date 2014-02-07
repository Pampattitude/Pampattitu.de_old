var mongooseLib = require('mongoose');

var schema = new mongooseLib.Schema({
    technicalName: {type: String, required: true},
    title: {type: String, required: true},
    img: {type: String},
    tags: {type: [String]},
    caption: {type: String, required: true},
    content: {type: String, required: true},

    views: {type: Number, default: 0},

    lastUpdated: {type: Date, default: new Date()},
    history: {
	type: [Date], default: [new Date()]
    },
    featured: {type: Boolean, default: false}
});

exports.model = mongooseLib.model('Article', schema);

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
    return exports.model.findOne({featured: true}, callback);
};

var getLatest = function (limit, callback) {
    return exports.model.find({}).sort({lastUpdated: -1}).limit(limit).exec(callback);
};

exports.getById = getById;
exports.getByTechnicalName = getByTechnicalName;
exports.findWithTags = findWithTags;
exports.findOneWithTags = findOneWithTags;
exports.getFeatured = getFeatured;
exports.getLatest = getLatest;
