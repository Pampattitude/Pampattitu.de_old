var pushMessage = function(req, type, content) {
    if (!req.session.alerts)
	req.session.alerts = [];

    return req.session.alerts.push({
	type: type,
	content: content
    });
};

exports.pushMessage = pushMessage;
