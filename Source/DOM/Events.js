/*
---
name: DOMEvents
description: The DOM Events Class Mixin
provides: DOMEvents
requires: [Class, Events, Accessor]
...
*/


(function(){

var html = document.documentElement,
	DOM2Events = !!html.addEventListener;

var DOMEvents = new Class({

	Extends: Events,

	listen: function(type, fn, decoration){

		if (typeOf(decoration) != 'object') decoration = Events.normalizeDecoration(decoration);
		decoration['DOM'] = true;

		this.parent(type, fn, decoration);

		if (DOMEvents.lookupNative(type)) this.addEventListener(type, this._events[type].get(fn));

		return this;
	},

	ignore: function(type, fn){

		if (type && fn && DOMEvents.lookupNative(type)){
			this.removeEventListener(type, this._events[type].get(fn));
		}

		this.parent(type, fn);
		
		return this;
	},

	fire: function(type){
		if (DOMEvents.lookupNative(type)){
			if (DOM2Events){
				var event = document.createEvent('HTMLEvents');
				event.initEvent(type, true, true);
				this.node.dispatchEvent(event);				
			} else {
				this.node.fireEvent('on' + type, document.createEventObject());
			}
		} else {
			this.parent(type);
		}
		return this;
	}

});

DOM.implement(new DOMEvents);

Events.defineDecorator('DOM', function(type, fn){

	var Wrapper = DOMEvents.lookupWrapper(type) || (DOMEvents.lookupNative(type) == 2 ? DOM.Event : null),
		element = this;

	return function(){
		var args = Array.from(arguments);
		if (Wrapper) args[0] = new Wrapper(args[0]);
		fn.apply(element, args);
	};

});

DOMEvents.extend(new Accessor('Native')).defineNatives({
	click: 2, dblclick: 2, mouseup: 2, mousedown: 2, contextmenu: 2, //mouse buttons
	mousewheel: 2, DOMMouseScroll: 2, //mouse wheel
	mouseover: 2, mouseout: 2, mousemove: 2, selectstart: 2, selectend: 2, //mouse movement
	keydown: 2, keypress: 2, keyup: 2, //keyboard
	orientationchange: 2, // mobile
	touchstart: 2, touchmove: 2, touchend: 2, touchcancel: 2, // touch
	gesturestart: 2, gesturechange: 2, gestureend: 2, // gesture
	focus: 2, blur: 2, change: 2, reset: 2, select: 2, submit: 2, //form elements
	load: 2, unload: 1, beforeunload: 2, resize: 1, move: 1, DOMContentLoaded: 1, readystatechange: 1, //window
	error: 1, abort: 1, scroll: 1 //misc	
});

// In case you want your own wrapper, you can define one
DOMEvents.extend(new Accessor('Wrapper'))

})();

