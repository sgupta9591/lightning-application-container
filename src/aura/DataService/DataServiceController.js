({
	getRecordJS: function(cmp, event, helper) {
		helper.execute(cmp, event, helper.getRecord);
	},
	getRecordsJS: function(cmp, event, helper) {
		helper.execute(cmp, event, helper.getRecords);
	},
	getFieldSetDataJS: function(cmp, event, helper) {
		helper.execute(cmp, event, helper.getFieldSetData);
	},
	createRecordJS: function(cmp, event, helper) {
		helper.execute(cmp, event, helper.createRecord);
	},
	updateRecordJS: function(cmp, event, helper) {
		helper.execute(cmp, event, helper.updateRecord);
	},
	deleteRecordJS: function(cmp, event, helper) {
		helper.execute(cmp, event, helper.deleteRecord);
	},
	getRecordTypesJS: function(cmp, event, helper) {
		helper.execute(cmp, event, helper.getRecordTypes);
	},
	getRecordTypesMapJS: function(cmp, event, helper) {
		helper.execute(cmp, event, helper.getRecordTypesMap);
	},
	getPicklistValuesJS: function(cmp, event, helper) {
		helper.execute(cmp, event, helper.getPicklistValues);
	},
	executeQueryJS: function(cmp, event, helper) {
		helper.execute(cmp, event, helper.executeQuery);
	}
})