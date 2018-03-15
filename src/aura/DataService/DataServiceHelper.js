({
	execute: function(cmp, event, method) {
 		var params = event.getParam("arguments").params || {};
 		params.onSuccess = this.getAuraCallback(params.onSuccess, params.context);
 		params.onError = this.getAuraCallback(params.onError, params.context);
 		this.promise(method.bind(this, cmp, params)).then(params.onSuccess, params.onError);
	},
	executeServerAction: function(cmp, method, params, callback, context){
    	$A.enqueueAction(this.getServerAction(cmp, method, params, callback, context));
    },
	getRecord: function(cmp, params, resolve, reject) {
		var params = { recordId: params.recordId, fields: params.fields || [] };
		this.executeServerAction(cmp, 'getRecord', params, (cmp, data) => { resolve(this.parseJSON(data)); });
	},
	getRecords: function(cmp, params, resolve, reject) {
		var params = { objectName: params.objectName, fields: params.fields || [], whereClause: params.whereClause };
		this.executeServerAction(cmp, 'getRecords', params, (cmp, data) => { resolve(this.parseJSON(data)); });
	},
	getFieldSetData: function(cmp, params, resolve, reject) {
		var params = { objectName: params.objectName, fieldSetName: params.fieldSetName, whereClause: params.whereClause };
		this.executeServerAction(cmp, 'getFieldSetData', params, (cmp, data) => { resolve(this.parseJSON(data)); });
	},
	createRecord: function(cmp, params, resolve, reject){
		var params = { objectName: params.objectName, defaultFieldValues: params.defaultFieldValues };
		this.executeServerAction(cmp, 'createRecord', params, (cmp, recordId) => { resolve(recordId); });
	},
	updateRecord: function(cmp, params, resolve, reject){
		var params = { recordId: params.recordId, fieldValues: params.fieldValues };
		this.executeServerAction(cmp, 'updateRecord', params, (cmp, recordId) => { resolve(recordId); });
	},
	deleteRecord: function(cmp, params, resolve, reject) {
		var params = { recordId: params.recordId };
		this.executeServerAction(cmp, 'deleteRecord', params, (cmp, data) => { resolve(); });
	},
	getRecordTypes: function(cmp, params, resolve, reject) {
		var params = { objectName: params.objectName };
		this.executeServerAction(cmp, 'getRecordTypes', params, (cmp, data) => {
			resolve(this.parseJSON(data, []).reduce((list, item) => { 
				list.push({ id: item.Id, name: item.DeveloperName, label: item.Name }); return list; 
			}, []));
		});
	},
	getRecordTypesMap: function(cmp, params, resolve, reject) {
		var params = { objectName: params.sObjectName };
		this.executeServerAction(cmp, 'getRecordTypes', params, (cmp, data) => {
			resolve(JSON.stringify(this.parseJSON(data, []).reduce((map, item) => { 
				map[item.DeveloperName] = item.Id; return map; 
			}, {})));
		});
	},
	getPicklistValues: function(cmp, params, resolve, reject){
		var params = { objectName: params.objectName, picklistFieldName: params.picklistFieldName };
		this.executeServerAction(cmp, 'getPicklistValues', params, (cmp, options) => { resolve(this.parseJSON(options)); });
	},
	executeQuery: function(cmp, params, resolve, reject){
		var params = { query: params.query };
		this.executeServerAction(cmp, 'executeQuery', params, (cmp, results) => { resolve(this.parseJSON(results)); });
	}
})