/*
---
name: DOM.Events
description: Contains DOM methods for dealing with events. This file also includes mouseenter and mouseleave custom Element Events.
requires: [Events, Element, DOM.Event]
provides: [Element.Event, DOM.Events]
...
*/

(function(DOM){

var injectDOM = function(type){
	if (type.indexOf(':dom') != -1) return type;
	return type.replace(/(\w+)/, function(base){
		return base + ':dom';
	});
};

var DOMEvents = DOM.Events = new Class({

	Extends: Events,

	listen: function(type, fn){
		return this.parent(injectDOM(type), fn);
	}.overloadSetter(),

	ignore: function(type, fn){
		return this.parent(injectDOM(type), fn);
	}.overloadSetter()

});

DOM.implement(DOMEvents);

Events.defineDecorator('dom', {
	onListen: function(type, fn){
		var nativeEvent = DOMEvents.lookupNative(type), self = this;
		if (nativeEvent && type.indexOf(':') != -1){
			this.addEventListener(type, function(event){
				if (nativeEvent > 1) event = new DOM.Event(event);
				fn.call(self, event);
			}, nativeEvent == 2);
		}
	},
	onIgnore: function(type, fn){
		var nativeEvent = DOMEvents.lookupNative(type);
		if (nativeEvent && type.indexOf(':') != -1){
			this.removeEventListener(type, fn);
		}
	}
}).defineDecorator('related', function(){
	listener: function(type, fn){
		return function(event){
			var rt = event.get('relatedTarget'),
				related = ((rt == null) || (typeOf(this) != 'document' && rt != this && rt.prefix != 'xul' && !this.find(rt)));
			if (related) fn.apply(this, arguments);
		}
	}
}).defineShortcuts({
	'mouseenter': 'mouseover:dom:related',
	'mouseleave': 'mouseout:dom:related'
});

if (Browser.firefox) DOMEvents.defineShortcut('mousewheel', 'DOMMouseScroll:dom');

DOMEvents.extend(new Accessor('Native')).defineNatives({
	click: 3, dblclick: 3, mouseup: 3, mousedown: 3, contextmenu: 2, //mouse buttons
	mousewheel: 3, DOMMouseScroll: 2, //mouse wheel
	mouseover: 3, mouseout: 3, mousemove: 2, selectstart: 2, selectend: 2, //mouse movement
	keydown: 3, keypress: 3, keyup: 3, //keyboard
	focus: 2, blur: 2, change: 2, reset: 2, select: 2, submit: 2, //form elements
	load: 1, unload: 1, beforeunload: 2, resize: 1, move: 1, DOMContentLoaded: 1, readystatechange: 1, //window
	error: 1, abort: 1, scroll: 1 //misc
});

DOM.Element.defineSetter('events', function(events){
	this.listen(events);
});

}).call(this, DOM);
