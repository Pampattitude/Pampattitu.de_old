(function() {
    'use strict';

    return $(document).ready(function() {
        $('.alert-menu .alert .close').click(function() {
            return $(this).parent('.alert').slideToggle(200, function() {
                return $(this).remove();
            });
        });
    });
})();
