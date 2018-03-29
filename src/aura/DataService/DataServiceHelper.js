({
	execute: function(cmp, event, method) {
 		var params = event.getParam("arguments").params || {};
 		params.onSuccess = this.callback(params.onSuccess, params.context);
 		params.onError = this.callback(params.onError, params.context);
 		this.promise(method.bind(this, cmp, params)).then(params.onSuccess, params.onError);
	},
	executeServerAction: function(cmp, method, params){
    	return this.enqueueAction($A.enqueueAction, cmp, method, params);
    },
	getRecord: function(cmp, params, resolve, reject) {
		var params = { recordId: params.recordId, fields: params.fields || [] };
		this.executeServerAction(cmp, 'getRecord', params).then(this.parseJSON, reject).then(resolve);
	},
	getRecords: function(cmp, params, resolve, reject) {
		var params = { objectName: params.objectName, fields: params.fields || [], whereClause: params.whereClause };
		this.executeServerAction(cmp, 'getRecords', params).then(this.parseJSON, reject).then(resolve);
	},
	getFieldSetData: function(cmp, params, resolve, reject) {
		var params = { objectName: params.objectName, fieldSetName: params.fieldSetName, whereClause: params.whereClause };
		this.executeServerAction(cmp, 'getFieldSetData', params).then(this.parseJSON, reject).then(resolve);
	},
	createRecord: function(cmp, params, resolve, reject){
		var params = { objectName: params.objectName, defaultFieldValues: params.defaultFieldValues };
		this.executeServerAction(cmp, 'createRecord', params).then(resolve, reject);
	},
	updateRecord: function(cmp, params, resolve, reject){
		var params = { recordId: params.recordId, fieldValues: params.fieldValues };
		this.executeServerAction(cmp, 'updateRecord', params).then(resolve, reject);
	},
	deleteRecord: function(cmp, params, resolve, reject) {
		var params = { recordId: params.recordId };
		this.executeServerAction(cmp, 'deleteRecord', params).then(resolve, reject);
	},
	getRecordTypes: function(cmp, params, resolve, reject) {
		var params = { objectName: params.objectName };
		this.executeServerAction(cmp, 'getRecordTypes', params).then(this.parseJSON, reject)
		.then(this.partial(this.map, this, (item) => { return { id: item.Id, name: item.DeveloperName, label: item.Name }; }))
		.then(resolve);
	},
	getRecordTypesMap: function(cmp, params, resolve, reject) {
		var params = { objectName: params.objectName };
		this.executeServerAction(cmp, 'getRecordTypes', params).then(this.parseJSON, reject)
		.then(this.partial(this.reduce, this, (map, item) => { map[item.DeveloperName] = item.Id; return map; }, {}))
		.then(resolve);
	},
	getPicklistValues: function(cmp, params, resolve, reject){
		var params = { objectName: params.objectName, picklistFieldName: params.picklistFieldName };
		this.executeServerAction(cmp, 'getPicklistValues', params).then(this.parseJSON, reject).then(resolve);
	},
	executeQuery: function(cmp, params, resolve, reject){
		var params = { query: params.query };
		this.executeServerAction(cmp, 'executeQuery', params).then(this.parseJSON, reject).then(resolve);
	}
})