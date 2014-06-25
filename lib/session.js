'use strict';

var pushMessage = function(req, type, content) {
    if (!req.session.alerts)
        req.session.alerts = [];

    return req.session.alerts.push({
        type: type,
        content: content
    });
};

var setPreviousFormData = function(req, data) {
    req.session.previousFormData = data;
    return req.session.previousFormData;
};

var setRedirection = function(req, url) {
    req.session.redirectTo = url;
    return req.session.redirectTo;
};

exports.pushMessage = pushMessage;
exports.setPreviousFormData = setPreviousFormData;
exports.setRedirection = setRedirection;
