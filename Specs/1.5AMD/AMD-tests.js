
describe('AMD', function(){

	var tests = {

		'Core/Core': function(module){
			expect(typeof module.typeOf).toEqual('function');
		},

		'Element/Element': function(module){
			var el = new Element('div', {
				text: 'foo'
			});
			expect(el.get('text')).toEqual('foo');
		},

		'Types/Function': function(module){
			expect(typeof Function.attempt).toEqual('function');
		},

		'Types/Object': function(module){
			expect(typeof Object.attempt).toEqual('function');
		},

		'Class/Class': function(module){
			expect(typeof module.Class).not.toEqual('undefined');
		},

		'Class/Class.Extras': function(module){
			expect(typeof module.Events).not.toEqual('undefined');
			expect(typeof module.Chain).not.toEqual('undefined');
			expect(typeof module.Options).not.toEqual('undefined');
		},
		
		'Browser/Browser': function(module){
			expect(typeof module.Browser).not.toEqual('undefined');
		},

		'Fx/Fx.Tween': function(module){
			expect(typeof module.Fx).not.toEqual('undefined');
			expect(typeof module.Fx.CSS).not.toEqual('undefined');
			expect(typeof module.Fx.Tween).not.toEqual('undefined');
		},

		'Request/Request.JSON': function(module){
			expect(typeof module.JSON.encode).not.toEqual('undefined');
			expect(typeof module.Request).not.toEqual('undefined');
			expect(typeof module.Request.JSON).not.toEqual('undefined');
		}

	};

	for (var name in tests) (function(name, test){

		it('should load ' + name, function(){

			var module;

			require([name], function(_module){
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

