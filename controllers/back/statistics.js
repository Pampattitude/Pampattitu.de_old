'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../../lib/console');
var utilsLib = require(__dirname + '/../../lib/utils');

var commonBack = require(__dirname + '/common');

var controller_ = function() {
    this.render = function(req, res, renderCallback) {
        commonBack.setCommonFields(res);

        return asyncLib.series([
            function(statCallback) {
                return asyncLib.series([
                    function(substatCallback) {
                        return mongooseLib.model('Article').count(function(err, articleCount) {
                            if (err)
                                return substatCallback(err);

                            res.locals.articleCount = articleCount;
                            return substatCallback();
                        });
                    },
                    function(substatCallback) {
                        return mongooseLib.model('Report').count({state: {$in: ['open', 'inProgress']}}, function(err, reportCount) {
                            if (err)
                                return substatCallback(err);

                            res.locals.openReportCount = reportCount;
                            return substatCallback();
                        });
                    },
                    function(substatCallback) {
                        return mongooseLib.model('FetchedLink').count({state: 'new'}, function(err, linkCount) {
                            if (err)
                                return substatCallback(err);

                            res.locals.linkCount = linkCount;
                            return substatCallback();
                        });
                    },
                ], statCallback);
            },
            function(statCallback) {
                var lastYear = new Date();
                lastYear.setYear(lastYear.getFullYear() - 1);

                var aggregationOptions = [
                    {
                        $match: {
                            created: {$gte: lastYear},
                        },
                    },
                    {
                        $group: {
                            _id: {
                                year: {$year: '$created'},
                                month: {$month: '$created'},
                            },
                            count: {$sum: 1},
                        },
                    },
                ];

                return mongooseLib.model('Article').aggregate(aggregationOptions, function(err, results) {
                    if (err)
                        return statCallback(err);

                    var tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);

                    var articleByDateList = [];
                    while (tomorrow >= lastYear) {
                        var idx = 0;
                        for ( ; results.length > idx ; ++idx) {
                            if (results[idx]._id.year == lastYear.getFullYear() &&
                                results[idx]._id.month - 1 == lastYear.getMonth())
                                break ;
                        }

                        articleByDateList.push({
                            date: lastYear.getFullYear() + '-' + utilsLib.prepadNumber(lastYear.getMonth() + 1),
                            count: (results.length > idx ? results[idx].count : 0),
                        });
                        lastYear.setMonth(lastYear.getMonth() + 1);
                    }

                    res.locals.articleByDateList = articleByDateList;

                    return statCallback();
                });
            },
        ],
        function(err) {
            if (err)
                return renderCallback(err);

            res.locals.title = 'Statistics';
            res.locals.contentPath = 'pages/back/statistics';

            return renderCallback();
        });
    };
};

exports.Controller = controller_;
