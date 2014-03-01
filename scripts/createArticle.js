var mongooseLib = require('mongoose');

var consoleLib = require('../lib/console');

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

    require('../models/articles.js').model;
    require('../models/tags.js').model;
    require('../models/users.js').model;

    consoleLib.log('Collections sync\'ed');

    var Article = require('../models/articles.js').model;
    mongooseLib.connection.collections['articles'].drop();
    consoleLib.log('Emptied articles collection.');

    var elem = new Article({});

    elem.technicalName = "test";
    elem.title = "Test";
    elem.img = "http://upload.wikimedia.org/wikipedia/commons/b/b5/Valle_Hermoso_Pampa_de_Olaen.jpg";
    elem.tags = ['this', 'is', 'a', 'test'];
    elem.caption = "Pellentesque pretium tortor quis nulla pulvinar, pellentesque lobortis dolor venenatis. Sed consectetur luctus odio, at lobortis neque euismod et. Quisque eu mauris eget velit ultricies consequat. Vestibulum egestas imperdiet vehicula. Quisque turpis mi, consequat non quam sit amet, sagittis molestie lacus. Donec sed interdum lorem. Donec venenatis urna vitae odio tempus consectetur. Maecenas tempor metus id lacus vestibulum, placerat laoreet enim pharetra.";
    elem.content =
	"<p>\
Pellentesque pretium tortor quis nulla pulvinar, pellentesque lobortis dolor venenatis. Sed consectetur luctus odio, at lobortis neque euismod et. Quisque eu mauris eget velit ultricies consequat. Vestibulum egestas imperdiet vehicula. Quisque turpis mi, consequat non quam sit amet, sagittis molestie lacus. Donec sed interdum lorem. Donec venenatis urna vitae odio tempus consectetur. Maecenas tempor metus id lacus vestibulum, placerat laoreet enim pharetra.\
</p>\
<h3>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...</h3>\
<p>\
Aenean metus velit, venenatis a hendrerit ut, dignissim eget est. Nulla facilisi. Nam elementum velit ut dignissim sollicitudin. Mauris faucibus justo ligula, vel cursus metus porta vel. Cras quis condimentum sapien. Integer feugiat interdum diam, et volutpat leo. Cras nec pretium quam, sed fermentum ante. Sed ultricies a ante in dictum. Sed quis porta mauris. Nam a bibendum arcu. Fusce eros purus, sagittis nec enim non, accumsan viverra lacus. Pellentesque tempor mattis ante in rhoncus.\
</p>\
<p>\
Donec sollicitudin ante eget nulla suscipit faucibus. Sed in eleifend magna, quis interdum lectus. Vivamus pellentesque posuere arcu et malesuada. Vivamus pretium vitae nulla in vulputate. Ut cursus cursus est, vel vestibulum nulla condimentum vitae. Suspendisse a dolor scelerisque, pellentesque quam id, laoreet urna. Nulla feugiat convallis nisl, eget placerat sapien viverra id. Suspendisse blandit mollis nisi, ac semper nisl pharetra ut. Curabitur tristique quam nec nunc scelerisque, eget egestas neque tempus. Phasellus risus tellus, venenatis hendrerit quam id, laoreet accumsan turpis. Proin non nisi a augue rhoncus sodales at vel nunc. Aliquam erat volutpat. Praesent fringilla congue rutrum. Cras sed convallis turpis. Proin elementum est quis accumsan vulputate. Aliquam at odio at tellus molestie luctus.\
<img src=\"http://images.wikia.com/thecompletelypointless/images/0/0a/ASDF_Movie!.png\">\
</p>\
<p>\
Fusce consequat libero neque, sed viverra justo vestibulum sit amet. Ut nisl ante, vehicula ut tellus quis, molestie ultricies enim. Praesent imperdiet consequat velit ac viverra. Vestibulum elementum enim sit amet magna ullamcorper, eget malesuada ipsum blandit. Quisque adipiscing sem eu mauris aliquam, ac tempor nunc venenatis. Integer accumsan facilisis fermentum. Donec quis fermentum urna, id volutpat augue. Curabitur nunc sapien, vulputate quis tincidunt eu, ultrices non ipsum. Nullam iaculis dolor nec leo dictum, sit amet fermentum tellus accumsan. Vestibulum vitae ultrices odio. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam pellentesque ornare leo, sit amet pellentesque dolor porta et. Aenean posuere velit eu tincidunt sagittis. Sed sollicitudin tellus augue, sit amet vulputate eros dictum ut. Nullam eget dui augue.\
</p>\
<p>\
<a href=\"#\">Sed pellentesque enim nunc</a>, vel pretium neque lacinia a. Nunc id lorem cursus, ornare metus ac, ultricies nisi. Sed tristique lacus et porta scelerisque. Nullam id urna et massa porttitor pretium. Sed ac libero eu leo interdum euismod. Praesent eget velit condimentum, volutpat ligula sit amet, convallis augue. Etiam malesuada tellus enim, id mattis ante sodales sed. Proin aliquam odio facilisis facilisis posuere. Duis vel est sem. Suspendisse et augue a lorem elementum cursus in eget leo. Donec nulla justo, pretium ac lobortis a, mattis ut eros.\
</p>";
    elem.author = 'Pampa';
    elem.featured = true;
    elem.lastUpdated = new Date().toISOString();
    elem.views = 1631;

    elem.save();
    consoleLib.log('Created new article.');

    for (var i = 0 ; 10 > i ; i++) {
	elem = new Article({});

	elem.technicalName = "test" + i;
	elem.title = "This is a simple test (#" + i + ') to check things';
	elem.img = "http://www.blueboat.fr/wp-content/uploads/2012/02/test-referencement-smo.jpg"
	elem.tags = ['this', 'is', 'a', 'test'];
	elem.caption = "Pellentesque pretium tortor quis nulla pulvinar, pellentesque lobortis dolor venenatis. Sed consectetur luctus odio, at lobortis neque euismod et. Quisque eu mauris eget velit ultricies consequat.";
	elem.content =
	    "<p>\
Pellentesque pretium tortor quis nulla pulvinar, pellentesque lobortis dolor venenatis. Sed consectetur luctus odio, at lobortis neque euismod et. Quisque eu mauris eget velit ultricies consequat. Vestibulum egestas imperdiet vehicula. Quisque turpis mi, consequat non quam sit amet, sagittis molestie lacus. Donec sed interdum lorem. Donec venenatis urna vitae odio tempus consectetur. Maecenas tempor metus id lacus vestibulum, placerat laoreet enim pharetra.\
</p>\
<h3>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...</h3>\
<p>\
Aenean metus velit, venenatis a hendrerit ut, dignissim eget est. Nulla facilisi. Nam elementum velit ut dignissim sollicitudin. Mauris faucibus justo ligula, vel cursus metus porta vel. Cras quis condimentum sapien. Integer feugiat interdum diam, et volutpat leo. Cras nec pretium quam, sed fermentum ante. Sed ultricies a ante in dictum. Sed quis porta mauris. Nam a bibendum arcu. Fusce eros purus, sagittis nec enim non, accumsan viverra lacus. Pellentesque tempor mattis ante in rhoncus.\
</p>\
<p>\
Donec sollicitudin ante eget nulla suscipit faucibus. Sed in eleifend magna, quis interdum lectus. Vivamus pellentesque posuere arcu et malesuada. Vivamus pretium vitae nulla in vulputate. Ut cursus cursus est, vel vestibulum nulla condimentum vitae. Suspendisse a dolor scelerisque, pellentesque quam id, laoreet urna. Nulla feugiat convallis nisl, eget placerat sapien viverra id. Suspendisse blandit mollis nisi, ac semper nisl pharetra ut. Curabitur tristique quam nec nunc scelerisque, eget egestas neque tempus. Phasellus risus tellus, venenatis hendrerit quam id, laoreet accumsan turpis. Proin non nisi a augue rhoncus sodales at vel nunc. Aliquam erat volutpat. Praesent fringilla congue rutrum. Cras sed convallis turpis. Proin elementum est quis accumsan vulputate. Aliquam at odio at tellus molestie luctus.\
<img src=\"http://images.wikia.com/thecompletelypointless/images/0/0a/ASDF_Movie!.png\">\
</p>\
<p>\
Fusce consequat libero neque, sed viverra justo vestibulum sit amet. Ut nisl ante, vehicula ut tellus quis, molestie ultricies enim. Praesent imperdiet consequat velit ac viverra. Vestibulum elementum enim sit amet magna ullamcorper, eget malesuada ipsum blandit. Quisque adipiscing sem eu mauris aliquam, ac tempor nunc venenatis. Integer accumsan facilisis fermentum. Donec quis fermentum urna, id volutpat augue. Curabitur nunc sapien, vulputate quis tincidunt eu, ultrices non ipsum. Nullam iaculis dolor nec leo dictum, sit amet fermentum tellus accumsan. Vestibulum vitae ultrices odio. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam pellentesque ornare leo, sit amet pellentesque dolor porta et. Aenean posuere velit eu tincidunt sagittis. Sed sollicitudin tellus augue, sit amet vulputate eros dictum ut. Nullam eget dui augue.\
</p>\
<p>\
<a href=\"#\">Sed pellentesque enim nunc</a>, vel pretium neque lacinia a. Nunc id lorem cursus, ornare metus ac, ultricies nisi. Sed tristique lacus et porta scelerisque. Nullam id urna et massa porttitor pretium. Sed ac libero eu leo interdum euismod. Praesent eget velit condimentum, volutpat ligula sit amet, convallis augue. Etiam malesuada tellus enim, id mattis ante sodales sed. Proin aliquam odio facilisis facilisis posuere. Duis vel est sem. Suspendisse et augue a lorem elementum cursus in eget leo. Donec nulla justo, pretium ac lobortis a, mattis ut eros.\
</p>";
	elem.author = 'Pampa';
	elem.lastUpdated = new Date().toISOString();
	elem.views = Math.random() * 2000;

	elem.save();
	consoleLib.log('Created new article.');

    }
});
