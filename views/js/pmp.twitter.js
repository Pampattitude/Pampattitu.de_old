$(document).ready(function() {
    $.fn.writeText = function(content) {
        var contentArray = content.split(""),
        current = 0,
        elem = this;
        var id = setInterval(function() {
            if (current < contentArray.length)
                elem.text(elem.text() + contentArray[current++]);
            else
                clearInterval(id);
        }, 10);
    };

    $.ajax('/getLatestTweet')
        .done(function(data) {
            var twDiv = $('.latest-tweet');
            if (!twDiv.length)
                return ;

            if (!data)
                data = {};
            if (!data.latestTweetLink)
                data.latestTweetLink = 'http://twitter.com/Pampattitude';
            if (!data.latestTweet) {
                $('a', twDiv).attr('href', data.latestTweetLink);
                $('span.text', twDiv).writeText('Could not get latest tweet <span class="icon-wondering"></span>');
                return ;
            }

            $('a', twDiv).attr('href', data.latestTweetLink);

            data.latestTweet = data.latestTweet.replace(/&amp;/, '&');

            $('span.text', twDiv).writeText(data.latestTweet);
        })
        .fail(function(err) {
        });
});
