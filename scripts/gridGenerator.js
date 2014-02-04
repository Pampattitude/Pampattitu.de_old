var gridSizes = [12, 10, 8, 6, 5, 4, 3, 2];
var minified = false;
var useHack = true;

var results = {};

for (var cnt = 0 ; gridSizes.length > cnt ; cnt++) {
    var fractions = [];
    var gridSize = gridSizes[cnt];
    var fractionsSize = gridSize;

    for (var i = 1 ; fractionsSize >= i ; i++) {
        fractions.push({nb: i, on: fractionsSize})
    }

    var finalFractions = [];
    for (var i = 0 ; fractions.length > i ; i++) {
        var res = (fractions[i].nb * 100) / (fractions[i].on);

        finalFractions.push({nb: fractions[i].nb, on: fractions[i].on, res: res});
    }

    for (var i = 0 ; finalFractions.length > i ; i++) {
        var fixedRes = (Math.floor(finalFractions[i].res * 100) / 100).toFixed(2)

        if (!results[fixedRes])
            results[fixedRes] = [];

        results[fixedRes].push({nb: finalFractions[i].nb, on: finalFractions[i].on});
    }
}

var modes = [
    { media: '@media all', classAppend: '' },
    { media: '@media only screen and (max-width: 767px)', classAppend: '-mobile' },
    { media: '@media only screen and (min-width: 768px) and (max-width: 991px)', classAppend: '-tablet' },
    { media: '@media only screen and (max-width: 991px)', classAppend: '-handheld' },
];

for (var modeIdx = 0 ; modes.length > modeIdx ; ++modeIdx) {
    var mode = modes[modeIdx];

    console.log(mode.media + '{');
    console.log('    [class*="grid-"] {');
    console.log('        width: 100%;');
    console.log('    }');
    console.log();

    console.log('    [class*="grid-"] > [class*="cell' + mode.classAppend + '"],')
    console.log('    [class*="grid-"] > [class*="padd' + mode.classAppend + '"] {');
    console.log('        width: 0%; /* Hide unsupported cell sizes (for better debugging) */');
    console.log('        display: inline-block;');
    console.log('        float: left;');
    console.log();
    console.log('        margin: 0 auto;');
    console.log('        padding: 0;');
    console.log();
    console.log('        line-height: 1;');
    console.log('    }');

    for (var key in results) {
	console.log();

	// Hack, removes unfitting values from the results
	// if (useHack && 1 == results[key].length)
	//     continue ;

	for (var i = 0 ; results[key].length > i ; i++) {
            console.log('    .grid-' + results[key][i].on + ' > .cell' + mode.classAppend + '-' + results[key][i].nb + ',');
            if (results[key].length == i + 1) {
		console.log('    .grid-' + results[key][i].on + ' > .padd' + mode.classAppend + '-' + results[key][i].nb + ' {');
            }
            else
		console.log('    .grid-' + results[key][i].on + ' > .padd' + mode.classAppend + '-' + results[key][i].nb + ',');
	}

	console.log('        width: ' + key + '%;');
	console.log('    }');
    }
    console.log('}');
}
