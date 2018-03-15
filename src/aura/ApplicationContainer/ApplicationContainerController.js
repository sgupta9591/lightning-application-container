({
	initContainerComponent: function(cmp, event, helper) { 
		var name = cmp.get("v.componentName");
		helper.navigate(cmp, name, helper.getRecordId(cmp), helper.getState(cmp));
	},
	navigateToComponent: function(cmp, event, helper) {
		event.stopPropagation();
		var cmpName = event.getParam("cmpName");
		var recordId = event.getParam("recordId");
		var state = event.getParam("state");
		helper.navigate(cmp, cmpName, recordId, state);
	},
	navigateToPreviousComponent: function(cmp, event, helper) {
		event.stopPropagation();
		var state = event.getParam("state");
		helper.navigateBack(cmp, state);
	},
	refreshView: function(cmp, event, helper) {
        event.stopPropagation();
        var cmpName = event.getParam("cmpName");
        var componentConfig = cmp.get("v.componentConfig");
		if(componentConfig && cmpName !== componentConfig.cmpName){
			helper.navigate(cmp, componentConfig.cmpName, componentConfig.params.recordId, componentConfig.params.state);
		}
    },
	locationChangeHandler: function(cmp, event, helper) {
		var newLocation = event.getParam("token");
		if(newLocation === cmp.get("v.location")) return;
		helper.log(cmp, "Location Change Detected");
		cmp.set("v.location", newLocation);
		var config = cmp.get("v.componentConfig");
		helper.setCurrentComponent(cmp, config.cmpName, config.params);
	},
	showHideSpinner: function(cmp, event, helper) {
		event.stopPropagation();
		var show = event.getParam("show"); 
		if(show && !cmp.get("v.showSpinner")) cmp.set("v.showSpinner", true);
		else if(!show && cmp.get("v.showSpinner")) cmp.set("v.showSpinner", false);
	},
	handleError: function(cmp, event) {
        var message = event.getParam("message");
        var error = event.getParam("error");
        helper.log(cmp, message, error);
    },
    initDataService: function(cmp, event, helper){
    	var params = event.getParam("params");
    	if(params) helper.initDataService(cmp).then(params.handler);
    }
})