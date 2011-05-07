/*
---
name: Events
description: Events
requires: [Type, Array, Function, Class, Table]
provides: Events
...
*/

(function(){

var Events = this.Events = new Class({

	listen: function(type, fn, decoration){
		if (!this._events) this._events = {};

		if (!this._events[type]) this._events[type] = new Table;
		var events = this._events[type];
		if (events.get(fn)) return this;

		var decorated = decorate.call(this, type, fn, decoration);

		events.set(fn, decorated);

		return this;
	}.overloadSetter(),

	ignore: function(type, fn){
		if (!this._events) return this;

		var events = this._events[type];
		if (!events) return this;

		if (type == null){ //ignore all
			for (var ty in this._events) this.ignore(ty);
		} else if (fn == null){ // ignore every of type
			events.each(function(fn){
				this.ignore(type, fn);
			}, this);
		} else { // ignore one
			events.unset(fn);
		}

		return this;
	}.overloadSetter(),

	fire: function(type){
		if (!this._events) return this;
		var events = this._events[type];
		if (!events) return this;

		var args = Array.slice(arguments, 1);

		events.each(function(fn, decorated){
			decorated.apply(this, args);
		}, this);

		return this;
	}

});

var decorate = function(type, fn, decoration){
	var decorated = fn;
	Object.each(normalizeDecoration(decoration), function(value, key){
		var decorator = Events.lookupDecorator(key);
		if (decorator) decorated = decorator.call(this, type, decorated, value, fn);
	}, this);
	return decorated;
};

Events.extend(new Accessor('Decorator')).defineDecorators({
	bind: function(type, fn){
		return fn.bind(this);
	},
	once: function(type, fn, decoration, origFn){
		return function(){
			this.remove(type, origFn);
			fn.apply(this, arguments);
		}
	}
});

var normalizeDecoration = Events.normalizeDecoration = function(decorators){
	var type = typeOf(decorators);
	if (type == 'object') return decorators;
	var newDecorators = {};
	if (type == 'array'){
		for (var l = decorators.length; l--;) newDecorators[decorators[i]] = true;
	}
	else if (type == 'string') newDecorators[decorator] = true;
	return newDecorators;
};

})();
