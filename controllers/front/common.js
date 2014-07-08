var setCommonFields = function(res) {
    res.locals.app = 'front';

    res.locals.inlineStyles.push('/css/pmp.front.common');
    res.locals.inlineStyles.push('/css/pmp.front');
};
exports.setCommonFields = setCommonFields;
