({
	initBaseComponent: function(cmp, event, helper) {
		//log record id and state of this component instance
		var cc = cmp.getConcreteComponent();
		helper.log(cc, "recordId", helper.getRecordId(cmp), "state", helper.getState(cmp));
	},
	navigateToPreviousComponent: function(cmp, event, helper) {
		helper.navigateToPreviousComponent(cmp);
	}
})