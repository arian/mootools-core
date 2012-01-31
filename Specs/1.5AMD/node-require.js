

var path = require('path');
var nodeRequire = require;
var loaded = {};

var define = function(id, deps, fn){
	if (typeof deps == 'function') fn = deps;
	var require = function(name){
		name = path.join(id, '../' + name);
		if (!loaded[name]) nodeRequire(normalizePath(name));
		return loaded[name];
	};
	var module = {exports: {}};
	var exports = fn.call(module.exports, require, module.exports, module);
	loaded[id] = exports != null ? exports : module.exports;
};

define.amd = {};

var normalizePath = function(name){
	for (var _path in amdRequire.config.paths){
		if (name.slice(0, _path.length) == _path){
			var replace = amdRequire.config.paths[_path];
			name = replace + name.slice(_path.length);
			break;
		}
	}
	return path.normalize(path.join(amdRequire.config.baseUrl, name));
};

var amdRequire = function(module){
	var file = normalizePath(module);
	nodeRequire(file);
	return loaded[module];
};

amdRequire.config = {
	baseUrl: __dirname,
	paths: {}
};

global.define = define;
module.exports = amdRequire;
