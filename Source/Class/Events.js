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
		if (decorated._onListen) decorated._onListen.run(this, [parsedType.type, decorated]);

		return this;
	}.overloadSetter(),

	ignore: function(type, fn){
		if (!this[uid]) return this;

		if (type == null){ //ignore all
			for (var ty in this[uid]) this.ignore(ty);
			return this;
		}

		var events = this[uid][type];
		if (!events) return this;

		if (fn == null){ // ignore every of type
			events.each(function(fn){
				this.ignore(type, fn);
			}, this);
		} else { // ignore one
			type = Events.lookupShortcut(type) || type;
			var origFn = fn, index;

			if (fn._decoration) this.ignore(fn._decoration, fn._fn);
			else if ((index = type.indexOf(':')) != -1) this.ignore(
				type = type.substr(0, index),
				fn = events.get(fn).extend('_decoration', null)
			);

			if (origFn._ignore) origFn._ignore.call(this, type, fn);
			events.unset(origFn);
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
		listener: function(type, fn, parsed, origFn){
			return function(){
				this.ignore(parsed.raw, origFn);
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
			decorator: parsedPseudos[i].key,
			raw: type
		});

		return object;
	},

	decorate: function(type, fn){
		if (typeOf(type) == 'string') type = Events.parseType(type);

		var decorators = type.decorators, stack = fn,
			onListen = [], onIgnore = [], decorator;

		for (var i = 0, l = decorators.length; i < l; i++){
			decorator = Events.lookupDecorator(decorators[i].decorator);
			if (decorator){
				if (decorator.listener) stack = decorator.listener.call(this, type.type, stack, decorators[i], fn);
				if (decorator.onListen) onListen.push(decorator.onListen);
				if (decorator.onIgnore) onIgnore.push(decorator.onIgnore);
			}
		}
		return stack.extend({_onListen: onListen, _onIgnore: onIgnore});
	}

}).extend(new Accessor('Shortcut'));

}).call(this);
