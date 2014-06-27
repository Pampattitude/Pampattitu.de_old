(function() {
    'use strict';

    return $(document).ready(function() {
        var selectedButtonClass = 'btn-facebook';

        $('#report-form #report-type').find('button[type="button"]').each(function(button) {
            $(this).click(function() {
                $(this).parents('#report-type').find('button').removeClass(selectedButtonClass); $(this).toggleClass(selectedButtonClass);
            });
        });
        $('#report-form #report-type').find('button[type="button"]:first').addClass(selectedButtonClass);

        $('form#report-form').submit(function() {
            $(this).append('<input type="hidden" name="type" value="' + $(this).find('#report-type .' + selectedButtonClass).attr('data-value') + '"/>');
        });
    });
})();
