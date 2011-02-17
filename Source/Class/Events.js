/*
---
name: Events
description: Events
requires: [Type, Array, Function, Class, Table]
provides: Events
...
*/

(function(){

var uid = '$' + String.uniqueID();

var Events = this.Events = new Class({

	listen: function(type, fn){
		type = Events.lookupShortcut(type) || type;

		if (!this[uid]) this[uid] = {};
		if (!this[uid][type]) this[uid][type] = new Table;

		var events = this[uid][type];
		if (events.get(fn)) return this;

		var parsedType = Events.parseType(type),
			decorated = fn;

		if (parsedType.type != type){
			decorated = Events.decorate.call(this, parsedType, fn);
			decorated.extend({_fn: fn, _decoration: type});
			this.listen(parsedType.type, decorated);
		}

		events.set(fn, decorated);
		if (fn._listen) fn._listen.call(this, type);

		return this;
	}.overloadSetter(),

	ignore: function(type, fn){
		if (!this[uid]) return this;

		var events = this[uid][type], index;
		if (!events) return this;

		if (type == null){ //ignore all
			for (var ty in this[uid]) this.ignore(ty);
		} else if (fn == null){ // ignore every of type
			events.each(function(fn){
				this.ignore(type, fn);
			}, this);
		} else { // ignore one
			type = Events.lookupShortcut(type) || type;

			if (fn._decoration) this.ignore(fn._decoration, fn._fn);
			if ((index = type.indexOf(':')) != -1) this.ignore(type.substr(0, index), events.get(fn));
			if (fn._ignore) fn._ignore.call(this, type);
			events.unset(fn);
		}

		return this;
	}.overloadSetter(),

	fire: function(type){
		if (!this[uid]) return this;

		type = Events.lookupShortcut(type) || type;

		var events = this[uid][type];
		if (!events) return this;

		var args = Array.slice(arguments, 1);

		events.each(function(fn, decorated){
			decorated.apply(this, args);
		}, this);

		return this;
	}

}).extend(new Accessor('Decorator')).defineDecorators({

	bind: {
		listener: function(type, fn){
			return fn.bind(this);
		}
	},

	once: {
		listener: function(type, fn){
			return function(){
				this.ignore(type, fn);
				fn.apply(this, arguments);
			};
		}
	}

}).extend({

	parseType: function(type){
		var object = {type: type, decorators: [], raw: type};
		if (type.indexOf(':') == -1) return object;

		var parsed = Slick.parse(type).expressions[0][0],
			parsedPseudos = parsed.pseudos;

		object.type = parsed.tag;

		for (var i = parsedPseudos.length; i--;) object.decorators.push({
			value: parsedPseudos[i].value,
			decorator: parsedPseudos[i].key
		});

		return object;
	},

	decorate: function(type, fn){
		if (typeOf(type) == 'string') type = Events.parseType(type);

		var decorators = type.decorators, decorator;
		for (var i = 0, l = decorators.length; i < l; i++){
			decorator = Events.lookupDecorator(decorators[i].decorator);
			if (decorator){
				fn = decorator.listener.call(this, type.type, fn, decorators[i].value);
				if (decorator.onListen) fn._ignore = decorator.onListen;
				if (decorator.onIgnore) fn._ignore = decorator.onIgnore;
			}
		}
		return fn;
	}

}).extend(new Accessor('Shortcut'));

}).call(this);
