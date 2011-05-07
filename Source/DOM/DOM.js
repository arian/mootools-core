/*
---
name: DOM
description: The base DOM Class
provides: DOM
requires: [Class, Store, Slick.parse, DOMEvents]
...
*/


(function(){

var nodeOf = function(item){
	return (item != null && item.toNode) ? item.toNode() : item;
};

var html = document.documentElement,
	DOM2Events = !!html.addEventListener,
	collected = {},
	wrappers = {};

var DOM = this.DOM = new Class({
	
	Implements: Store,

	initialize: function(node){
		node = this.node = nodeOf(node);
		var uid = DOM.uidOf(node);
		return (wrappers[uid] || (wrappers[uid] = this));
	},

	toNode: function(){
		return this.node;
	},

	addEventListener: /*<ltIE9>*/(DOM2Events ? /*</ltIE9>*/function(type, fn){
		this.node.addEventListener(type, fn, false);
		return this;
	}/*<ltIE9>*/ : function(type, fn){
		this.node.attachEvent('on' + type, fn);
		collected[DOM.uidOf(this)] = this;
		return this;
	})/*</ltIE9>*/,

	removeEventListener: /*<ltIE9>*/(DOM2Events ? /*</ltIE9>*/function(type, fn){
		this.node.removeEventListener(type, fn, false);
		return this;
	}/*<ltIE9>*/ : function(type, fn){
		this.node.detachEvent('on' + type, fn);
		return this;
	})/*</ltIE9>*/

});

DOM.prototype.log = DOM.prototype.toNode;

/* <ltIE9> */ // IE Purge
if (!DOM2Events){

	var clean = function(item){
		var uid = DOM.uidOf(item), node = item.toNode();
		item.ignore();
		if (node.clearAttributes) node.clearAttributes();
		delete collected[uid];
	};

	var unload = function(){
		Object.each(collected, clean);
		window.detachEvent('onunload', unload);
	};
	window.attachEvent('onunload', unload);

	if (window.CollectGarbage) CollectGarbage();
}
/* </ltIE9> */

})();
