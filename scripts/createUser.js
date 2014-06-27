'use strict';

var asyncLib = require('async');
var mongooseLib = require('mongoose');

var consoleLib = require(__dirname + '/../lib/console');

var databaseUri = 'mongodb://localhost/bmb-home';

mongooseLib.connect(databaseUri);
mongooseLib.connection.on('error', function (err) {
    // Handle error
    consoleLib.error('Could not open DB connection: ' + err);

    mongooseLib.connection.close();
    mongooseLib.connect(databaseUri);
});
mongooseLib.connection.once('open', function () {
    // Handle open;
    consoleLib.log('DB connection open');

    require(__dirname + '/../models/articles.js').model;
    require(__dirname + '/../models/tags.js').model;
    require(__dirname + '/../models/users.js').model;

    consoleLib.log('Collections sync\'ed');

    var User = require(__dirname + '/../models/users.js').model;
    mongooseLib.connection.collections['users'].drop();
    consoleLib.log('Emptied users collection.');

    var pampaUser = new User({});

    pampaUser.login = 'Pampa';
    pampaUser.alias = 'Pampa';

    var crypto = require('crypto');
    var shasum = crypto.createHash('sha1');

    shasum.update('1234');
    pampaUser.password = shasum.digest('hex');
    pampaUser.pictureUrl = 'http://i.imgur.com/Atsf9xx.png';

    pampaUser.description  = '<p>Hey there! C++, Node.js and whatever comes in developer in!</p>';
    pampaUser.description += '<p>Welcome to my website!</p>';
    pampaUser.description += '<br/>';
    pampaUser.description += '    I like video games, programming and, of course, cats.';
    pampaUser.description += '    <br/>';
    pampaUser.description += '    And last but not least, I compose orchestral music (here is my <a';
    pampaUser.description += '                                                        href="https://soundcloud.com/guichan"';
    pampaUser.description += '                                                        class="btn btn-soundcloud btn-inline"><span';
    pampaUser.description += '                                                        class="icon-soundcloud"></span> Soundcloud</a>).';
    pampaUser.description += '    <br/>';
    pampaUser.description += '    <br/>';
    pampaUser.description += '    If you like what you read here, feel free to ';
    pampaUser.description += '<a href="https://twitter.com/Pampattitude"';
    pampaUser.description += '   class="btn btn-twitter btn-inline"><span class="icon-twitter"></span>';
    pampaUser.description += '    follow me</a>, ';
    pampaUser.description += '<a href="https://www.facebook.com/Pampattitude"';
    pampaUser.description += '   class="btn btn-facebook btn-inline"><span class="icon-facebook"></span>';
    pampaUser.description += '    befriend me</a>, <a href="https://www.linkedin.com/pub/guillaume-delahodde/5a/751/44a/" class="btn btn-linkedin btn-inline"><span class="icon-linkedin"></span> contact me</a> or ';
    pampaUser.description += '<a href="https://www.rss.com/" class="btn btn-rss btn-inline"><span ';
    pampaUser.description += 'class="icon-feed2"></span> follow the website feed</a>!';
    pampaUser.description += '<br/>';
    pampaUser.description += '    You can also <a href="mailto:pampattitude@gmail.com"';
    pampaUser.description += '                class="btn btn-mail btn-inline"><span ';
    pampaUser.description += 'class="icon-mail"></span> mail me</a> for';
    pampaUser.description += '    any kind of request, feedback or bug report.';

    pampaUser.emailAddress = 'pampattitude@gmail.com';

    pampaUser.rights = 'admin';

    var guestUser = new User({});
    guestUser.login = 'guest';
    guestUser.rights = 'guest';

    var registeredUser = new User({});
    registeredUser.login = 'registered';
    registeredUser.rights = 'registered';

    var priviledgedUser = new User({});
    priviledgedUser.login = 'priviledged';
    priviledgedUser.rights = 'priviledged';
    priviledgedUser.description = 'I have nothing to say.';

    var users = [];
    users.push(pampaUser);
    users.push(guestUser);
    users.push(registeredUser);
    users.push(priviledgedUser);

    return asyncLib.each(users, function(user, userCallback) {
        return user.save(function(err) {
            if (err)
                return userCallback(err);

            consoleLib.log('Registered user "' + user.login + '"');
            return userCallback();
        });
    },
    function(err) {
        if (err) {
            consoleLib.error(err);
            return process.exit(1);
        }

        return process.exit(0);
    });
});
