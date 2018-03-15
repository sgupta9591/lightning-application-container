({
	performAction: function(cmp, event, helper){
		var actionId = event.currentTarget.getAttribute("data-actionId");
		var handler = helper.getActionHandler(cmp, actionId);
		if(handler) handler(actionId);
	}
})