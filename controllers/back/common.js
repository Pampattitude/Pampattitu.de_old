var setCommonFields = function(res) {
    res.locals.app = 'back';

    res.locals.inlineStyles.push('/css/pmp.back');
};
exports.setCommonFields = setCommonFields;
