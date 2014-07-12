'use strict';

var setCommonFields = function(res) {
    res.locals.app = 'front';

    res.locals.inlineStyles.push('/css/pmp.front');

    res.locals.buttonMenu = 'pages/front/button-menu';
};
exports.setCommonFields = setCommonFields;
