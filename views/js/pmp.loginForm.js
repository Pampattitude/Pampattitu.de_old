(function() {
    'use strict';

    var toggleLoginForm = null;

    return $(document).ready(function() {
        $('#login-form-panel').click(function() {
            return $('#login-form-panel').slideToggle(200, function() {
                return $('#login-form').slideToggle(200);
            });
        });

        $('#login-form button.close').click(function() {
            return $('#login-form').slideToggle(200, function() {
                return $('#login-form-panel').slideToggle(200);
            });
        });
    });
})();
