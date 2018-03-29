({
	initComponentBase : function(cmp, event, helper) {
		//bind all helper methods to helper object context
		var skippableMethods = ["wrapper", "callback", "auraCallback"];
		var cchelper = cmp.getConcreteComponent().helper;
		helper.each(helper.functions(helper), (name) => { 
			var func = helper[name];
			if(!skippableMethods.includes(name)){
				/* solution 1 - all methods will be running in context of first component helper object
				func = helper[name] = func.bind(cchelper);
	      		*/
				/* solution 2 - does not work if inner component also inherit component base
				if(func.prototype.original) func = func.prototype.original; 
				var boundFunc = helper.callback(func, cchelper);
				boundFunc.prototype.original = func;
				func = helper[name] = boundFunc;
				*/
				// solution 3 - working in all scenerios
				if(!func.prototype.original) {
					var boundFunc = helper.callback(func, helper);
					boundFunc.prototype.original = func;
					func = helper[name] = boundFunc;
				}
				func = cchelper[name] = helper.callback(func.prototype.original, cchelper);
			}
			helper.wrapper.prototype[name] = function() {
				var args = helper.reduce(arguments, helper.push, [this._wrapped]);
		        return helper.chain(func.apply(null, args));
	      	};
		});
		//method to break chaining 
		if(!helper.wrapper.prototype.value){
			helper.wrapper.prototype.value = function(){ 
				return this._wrapped; 
			};
		}
	}
})