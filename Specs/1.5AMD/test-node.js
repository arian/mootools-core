
var puts = require('util').puts;
var path = require('path');
var amdRequire = require('./node-require');
var jasmine = require('../Runner/Jasmine-Node/lib/jasmine');
var reporter = require('../Runner/Jasmine-Node/lib/reporters/console').Reporter;

global.has = {
	amd: true
};

amdRequire.config = {
	baseUrl: path.normalize(path.join(__dirname, '../../')),
	paths: {
		'MooTools/1': 'Source',
		'Slick': 'Source/Slick'
	}
};

// make jasmine global
for (var key in jasmine) global[key] = jasmine[key];

// console reporter
reporter.done = function(runner, log){
	process.exit(runner.results().failedCount);
};


// the tests
describe('Node AMD', function(){

	it('will test Class.Extras availability', function(){
		var Extras = amdRequire('MooTools/1/Class/Class.Extras');
		expect(Extras.Options).not.toBeNull();
		expect(Extras.Chain).not.toBeNull();
		expect(Extras.Events).not.toBeNull();
	});

	it('will test Array methods', function(){
		var Array = amdRequire('MooTools/1/Types/Array');
		expect([1, 2, 3].combine([2, 3, 4])).toEqual([1, 2, 3, 4]);
		expect(Array.combine([1, 2, 3], [2, 3, 4])).toEqual([1, 2, 3, 4]);
	});

	it('will test JSON methods', function(){
		var JSON = amdRequire('MooTools/1/Utilities/JSON');
		expect(JSON.encode({a: 1})).toEqual('{"a":1}');
	});

	it('should parse a CSS selector with Slick.Parse', function(){
		var Slick = amdRequire('Slick/Slick.Parser');
		var parsed = Slick.parse('div > a');
		expect(parsed.raw).toEqual('div > a');
	});

});

// Start Jasmine
var jasmineEnv = jasmine.getEnv();
jasmineEnv.reporter = reporter;
jasmineEnv.execute();
