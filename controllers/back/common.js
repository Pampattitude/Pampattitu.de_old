var setCommonFields = function(res) {
    res.locals.app = 'back';

    res.locals.inlineStyles.push('/css/pmp.back');

    res.locals.buttonMenu = 'pages/back/button-menu';
};
exports.setCommonFields = setCommonFields;
