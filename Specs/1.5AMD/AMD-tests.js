
describe('AMD', function(){

	// Currently some random tests to check whether the correct objects are required.

	var tests = {

		'Core/Core': function(Core){
			expect(typeof Core.typeOf).toEqual('function');
//			expect(typeof typeOf).toEqual('undefined');
//			expect(typeof instanceOf).toEqual('undefined');
//			expect(typeof Type).toEqual('undefined');
		},

		'Element/Element': function(Element){
			var el = new Element.Element('div', {
				text: 'foo'
			});
			expect(el.get('text')).toEqual('foo');
			expect(Element.$$('div').length).toBeGreaterThan(1);
//			expect(typeof IFrame).toEqual('undefined');
		},

		'Types/Function': function(Function){
			expect(typeof Function.attempt).toEqual('function');
		},

		'Types/Object': function(Object){
			expect(typeof Object.attempt).toEqual('function');
		},

		'Class/Class': function(Class){
			expect(typeof Class).not.toEqual('undefined');
//			expect(typeof window.Class).toEqual('undefined');
		},

		'Class/Class.Extras': function(Extras){
			expect(typeof Extras.Events).not.toEqual('undefined');
			expect(typeof Extras.Chain).not.toEqual('undefined');
			expect(typeof Extras.Options).not.toEqual('undefined');
//			expect(typeof Events).toEqual('undefined');
//			expect(typeof Chain).toEqual('undefined');
//			expect(typeof Options).toEqual('undefined');
		},
		
		'Browser/Browser': function(Browser){
			expect(typeof Browser.name).not.toEqual('undefined');
//			expect(typeof window.Browser).toEqual('undefined');
		},

		'Fx/Fx.Tween': function(Tween){
			expect(typeof Tween).not.toEqual('undefined');
//			expect(typeof Fx).toEqual('undefined');
		},

		'Request/Request.JSON': function(RequestJSON){
			expect(typeof RequestJSON).not.toEqual('undefined');
//			expect(typeof Request).toEqual('undefined');
		}

	};

	for (var name in tests) (function(name, test){

		it('should load ' + name, function(){

			var module;

			require(['MooTools/1/' + name], function(_module){
				module = _module;
			});

			waitsFor(function(){
				return module != null;
			}, 'loading ' + name, 500);

			runs(function(){
				test(module);
			});

		});

	})(name, tests[name]);

});

