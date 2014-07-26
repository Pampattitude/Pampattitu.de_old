$(document).ready(function() {
    $.fn.writeText = function(content) {
        var contentArray = content.split(''),
        current = 0,
        elem = this;
        var id = setInterval(function() {
            if (current < contentArray.length)
                elem.text(elem.text() + contentArray[current++]);
            else
                clearInterval(id);
        }, 10);
    };

    var internalSpinInterval = null;

    var twDiv = $('.latest-tweet');
    if (!twDiv.length)
        return ;

    var refreshTweets = function() {
        if (internalSpinInterval)
            clearInterval(internalSpinInterval);

        $.ajax('/getLatestTweet')
            .done(function(data) {
                var twDiv = $('.latest-tweet');
                if (!twDiv.length)
                    return ;

                var $tweetText = $('span.text', twDiv);

                if (!data.latestTweets || !data.latestTweets.length) {
                    $('a', twDiv).attr('href', 'https//twitter.com/Pampattitude');
                    $tweetText.writeText('Could not get latest tweet...');
                    return ;
                }

                var i = 0;
                var updateDisplayedTweet = function() {
                    $('a', twDiv).attr('href', data.latestTweets[i].link);

                    var tweetText = data.latestTweets[i].text.replace(/&amp;/, '&');

                    $tweetText.fadeOut(400, function() {
                        $tweetText.text('');
                        $tweetText.fadeIn(0);

                        return setTimeout(function() {
                            $tweetText.text(tweetText);
                            ++i;

                            if (data.latestTweets.length <= i)
                                i = 0;
                        }, 200 /* after 200 ms */);
                    });
                };

                updateDisplayedTweet();
                internalSpinInterval = setInterval(updateDisplayedTweet, 6 * 1000 /* every 6 seconds */);
                return ;
            })
            .fail(function(err) {
            });
    };

    refreshTweets();
    setInterval(refreshTweets, 60 * 1000 /* Every minute */);
});
