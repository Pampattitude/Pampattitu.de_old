var mongooseLib = require('mongoose');

var getModelsAndCollections = function(callback) {
    return require('fs').readdir(__dirname + '/../models', function(err, files) {
        if (err)
            return callback(err);

        for (var i = 0 ; files.length > i ; ++i) {
            try {
                require(__dirname + '/../models/' + files[i]);
            }
            catch (err) {
                return callback(err);
            }
        }

        var collections = [];
        var models = mongooseLib.models;

        for (var key in models) {
            collections.push({collection: models[key].collection.name, model: key});
        }

        return callback(null, collections);
    });
};
exports.getModelsAndCollections = getModelsAndCollections;
