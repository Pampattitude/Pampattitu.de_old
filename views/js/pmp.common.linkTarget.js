'use strict';

$(document).ready(function() {
    var excludeLinks = [
        'pampattitu.de',
    ];

    $('a[href^=http]').each(function() {
        var elem = $(this);

        for (var i = 0 ; excludeLinks.length > i ; ++i) {
            if (-1 != elem.attr('href').indexOf(excludeLinks[i]))
                return true;
        }

        var siteName = elem.attr('href');
        if (-1 != siteName.indexOf(':'))
            siteName = siteName.substring(siteName.indexOf(':') + 3, siteName.length);
        if (-1 != siteName.indexOf('/'))
            siteName = siteName.substring(0, siteName.indexOf('/'));

        elem.attr('target', '_blank');
        if (!elem.attr('title') &&
            !elem.attr('data-hint')) {
            if (!elem.has('[class*=hint--]'))
                elem.addClass('hint--top');
            elem.attr('data-hint', 'Visit "' + siteName + '" in new tab');
        }
    });

    $('a[href^=tel]').each(function() {
        var elem = $(this);

        for (var i = 0 ; excludeLinks.length > i ; ++i) {
            if (-1 != elem.attr('href').indexOf(excludeLinks[i]))
                return true;
        }

        var siteName = elem.attr('href');
        if (-1 != siteName.indexOf(':'))
            siteName = siteName.substring(siteName.indexOf(':') + 1, siteName.length);

        elem.attr('target', '_blank');
        if (!elem.attr('title') &&
            !elem.attr('data-hint')) {
            if (!elem.has('[class*=hint--]'))
                elem.addClass('hint--top');
            elem.attr('data-hint', 'Call "' + siteName + '"');
        }
    });

    $('a[href^=mailto]').each(function() {
        var elem = $(this);

        for (var i = 0 ; excludeLinks.length > i ; ++i) {
            if (-1 != elem.attr('href').indexOf(excludeLinks[i]))
                return true;
        }

        var siteName = elem.attr('href');
        if (-1 != siteName.indexOf(':'))
            siteName = siteName.substring(siteName.indexOf(':') + 1, siteName.length);

        elem.attr('target', '_blank');
        if (!elem.attr('title') &&
            !elem.attr('data-hint')) {
            if (!elem.has('[class*=hint--]'))
                elem.addClass('hint--top');
            elem.attr('data-hint', 'Contact "' + siteName + '"');
        }
    });
});
