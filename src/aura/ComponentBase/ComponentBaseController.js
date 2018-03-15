({
	initComponentBase : function(component, event, helper) {
		//bind all helper methods to helper object context
		helper.each(helper.functions(helper), (name) => { 
			var func = helper[name];
			if(name !== "wrapper"){
				func = helper[name] = func.bind(helper);
			}
			helper.wrapper.prototype[name] = function() {
		        var args = helper.extend([this._wrapped], arguments);
		        return helper.chain(func.apply(helper, args));
	      	};
		});
		//method to break chaining 
		helper.wrapper.prototype.value = function() { 
			return this._wrapped; 
		};
	}
})