({
	initBaseComponent: function(cmp, event, helper) {
		//log record id and state of this component instance
		helper.log(cmp.getConcreteComponent(), "recordId", helper.getRecordId(cmp), "state", helper.getState(cmp));
	},
	navigateToPreviousComponent: function(cmp, event, helper) {
		helper.navigateToPreviousComponent(cmp);
	},
	refreshComponent: function(cmp, event, helper){
		helper.refreshComponent(cmp);
	}
})