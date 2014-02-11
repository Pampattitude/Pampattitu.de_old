var objectToArray = function(self) {
    // Preferencially choses self as current object
    var obj = self || this;

    var ret = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            ret.push(obj[prop]);
    }
    return ret;
};
exports.objectToArray = objectToArray;

var objectToObjectArray = function(self) {
    // Preferencially choses this as current object
    var obj = this || self;

    var ret = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            ret.push({
                key: prop,
                val: obj[prop],
            });
        }
    }
    return ret;
};
exports.objectToObjectArray = objectToObjectArray;

var newEmptyObject = function(data) {
    var obj = new Object();

    for (var prop in obj) {
        delete obj[prop];
    }

    for (var prop in data) {
        obj[prop] = data[prop];
    }

    return obj;
}
exports.newEmptyObject = newEmptyObject;

var traceCaller = function(n) {
    if (isNaN(n) || n < 0)
        n = 1;
    n += 1;
    var s = (new Error()).stack, a=s.indexOf('\n', 5);

    while (n--) {
        a = s.indexOf('\n', a + 1);
        if (a < 0) {
            a = s.lastIndexOf('\n', s.length);
            break;
        }
    }
    b = s.indexOf('\n', a + 1);
    if (b < 0)
        b = s.length;
    a = Math.max(s.lastIndexOf(' ', b), s.lastIndexOf('/', b));
    b = s.lastIndexOf(':', b);
    s = s.substring(a + 1, b);
    return s;
};
exports.traceCaller = traceCaller;

// deepmerge by Zachary Murray (dremelofdeath) CC-BY-SA 3.0
var mergeObjects = function(foo, bar) {
    var merged = {};
    for (var each in bar) {
        if (foo.hasOwnProperty(each) && bar.hasOwnProperty(each)) {
            if (typeof(foo[each]) == "object" && typeof(bar[each]) == "object") {
                merged[each] = deepmerge(foo[each], bar[each]);
            }
            else {
                merged[each] = [foo[each], bar[each]];
            }
        }
        else if(bar.hasOwnProperty(each)) {
            merged[each] = bar[each];
        }
    }
    for (var each in foo) {
        if (!(each in bar) && foo.hasOwnProperty(each)) {
            merged[each] = foo[each];
        }
    }
    return merged;
}
exports.mergeObjects = mergeObjects;
