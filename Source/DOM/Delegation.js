
(function(){

DOM.Events.defineDecorator('relay', function(type, fn, decoration){

	return function(event){
		if (event.get('target').match(decoration.match)) fn.call(this, event);
	};

});

})();
