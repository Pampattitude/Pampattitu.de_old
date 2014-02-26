var jsdomLib = require('jsdom');

var constantsLib = require(__dirname + '/constants');
var consoleLib = require(__dirname + '/console');

var cleanHtmlInput = function(html, callback) {
    var validTagNames = ['a', 'b', 'i', 'img', 'p', 'span', 'sub', 'sup', 'u'];
    var validAttributeNames = ['class', 'href', 'src'];

    return jsdomLib.env(html, [constantsLib.jQueryPath], function(err, window) {
        if (err) {
            window.close();
            return callback(err);
        }

        var $ = jQuery = window.jQuery;
        if (!$) {
            window.close();
            return callback(new Error('Could not get jQuery'));
        }

        consoleLib.log($('body').html());
        $.fn.getAttributes = function() { var attributes = {}; if (this.length) { $.each(this[0].attributes, function(index, attr) { attributes[attr.name] = attr.value; }); } return attributes; };

        $('body *').each(function() {
            // Clean tags
            (function() {
                var found = false;
                for (var i = 0 ; validTagNames.length > i ; ++i) {
                    if ($(this).prop("tagName") == validTagNames[i].toUpperCase()) {
                        consoleLib.info(this + ' OK');
                        found = true;
                        break ;
                    }
                }

                if (!found) {
                    consoleLib.warn('Detaching node ' + this);
                    $(this).detach();
                }
            }).call(this);

            // Clean attributes
            (function() {
                var attrs = $(this).getAttributes();
                for (var attr in attrs) {
                    var found = false;
                    for (var j = 0 ; validAttributeNames.length > j ; ++j) {
                        if (validAttributeNames[j] == attr) {
                            found = true;
                            break ;
                        }
                    }

                    if (!found) {
                        $(this).removeAttr(attr);
                        consoleLib.warn('Should remove attribute ' + attr + ' (=' + attrs[attr] + ')');
                    }
                }
            }).call(this);
        });


        var finalHtml = $('body').html();

        window.close();
        return callback(null, finalHtml);
    });
};

cleanHtmlInput('<p><span>T</span>his is a <b class="poney">test</b> <span id="lol">about monkeys</span></p>', function(err, res) {
    consoleLib.log('Results:');
    consoleLib.log(res);
});
