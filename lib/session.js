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

exports.pushMessage = pushMessage;
exports.setPreviousFormData = setPreviousFormData;
