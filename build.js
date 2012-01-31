
var fs = require('fs'),
	requirejs = require('requirejs');

// Nice colors
var log = {
	ANSIColors: {
		green:  '\033[32m',
		red:    '\033[31m',
		cyan:   '\033[36m',
		yellow: '\033[1;33m',
		normal: '\033[0m'
	},
	log: function(msg, color){
		console.log((this.ANSIColors[color] || this.ANSIColors.normal) + msg + this.ANSIColors.normal);
	}
};
for (var col in log.ANSIColors) (function(col){
	log[col] = function(msg){
		this.log(msg, col);
	};
})(col);

var help = 'Usage: node build.js [options] <modules>\n'
	+ '\n'
	+ ' --help                 Show this help message\n'
	+ ' --optimize             Use to optimize the file with UglifyJS\n'
	+ ' --has <key> <value>    Set key-values for has.js\n'
	+ ' --all                  Includes all modules\n'
	+ '\n';

// array with modules we'll require
var requires = [];
var has = Object.create(null);
var optimize = false;

for (var i = 2; i < process.argv.length; i++){
	var arg = process.argv[i];
	if (arg == '--help'){
		console.log(help);
		process.exit(0);
	} else if (arg == '--optimize'){
		optimize = true;
	} else if (arg == '--has'){
		has[process.argv[++i]] = process.argv[++i] == 'true';
	} else if (arg == '--all'){

		[
			'Core/Core',
			'Types/Array',
			'Types/String',
			'Types/Number',
			'Types/Function',
			'Types/Object',
			'Types/DOMEvent',
			'Browser/Browser',
			'Class/Class',
			'Class/Class.Extras',
			'Element/Element',
			'Element/Element.Style',
			'Element/Element.Event',
			'Element/Element.Delegation',
			'Element/Element.Dimensions',
			'Fx/Fx',
			'Fx/Fx.CSS',
			'Fx/Fx.Tween',
			'Fx/Fx.Morph',
			'Fx/Fx.Transitions',
			'Request/Request',
			'Request/Request.HTML',
			'Request/Request.JSON',
			'Utilities/Cookie',
			'Utilities/JSON',
			'Utilities/DOMReady',
			'Utilities/Swiff'
		].forEach(function(file){
			requires.push('MooTools/1/' + file);
		});

		requires.push('Slick/Slick.Parser');
		requires.push('Slick/Slick.Finder');

	} else {
		requires.push(arg);
	}
}

// make requires unique, we only have to care about strings, so we can use object keys.
requires = (function(){
	var o = {};
	for (var i = requires.length; i--;) o[requires[i]] = 1;
	return Object.keys(o);
})();

if (!requires.length){
	log.red('\nYou did not select any modules!\n');
	process.exit(0);
}

var config = {
	baseUrl: __dirname,
	paths: {
		'MooTools/1': 'Source',
		'Slick': 'Source/Slick'
	},
	out: 'mootools-amd.js',
	optimize: optimize ? 'uglify' : 'none',
	include: requires,
	has: has
};

requirejs.optimize(config, function(buildResponse){
	//buildResponse is just a text output of the modules
	//included. Load the built file for the contents.
	//Use config.out to get the optimized file contents.
	var contents = fs.readFileSync(config.out, 'utf8');
	process.stdout.write(contents + '\n');
});
