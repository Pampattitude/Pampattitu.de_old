var pushMessage = function(req, type, content) {
    if (!req.session.alerts)
	req.session.alerts = [];

    return req.session.alerts.push({
	type: type,
	content: content
    });
};

var setPreviousFormData = function(req, data) {
    return req.session.previousFormData = data;
};

var setRedirection = function(req, url) {
    return req.session.redirectTo = url;
};

exports.pushMessage = pushMessage;
exports.setPreviousFormData = setPreviousFormData;
exports.setRedirection = setRedirection;
