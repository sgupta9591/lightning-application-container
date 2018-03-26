({
	//getters-setters
	getRecordId: function(cmp){ return cmp.get("v.recordId"); },
    getState: function(cmp){ return cmp.get("v.state") || {}; },
    getActions: function(cmp){ return cmp.get("v.actions"); },
    setRecordId: function(cmp, recordId){ cmp.set("v.recordId", recordId); },
    setState: function(cmp, state){ cmp.set("v.state", state || {}); },
    saveState: function(cmp, state){ this.setState(cmp, this.extend(this.getState(cmp), state)); },
    setActions: function(cmp, actions){ cmp.set("v.actions", actions || []); },

    //data service
    dataService: null,
    dataServiceWrapper: {},
    pendingDataServiceRequests: {},
    dataServiceMethods: [
        "getRecord", "getRecords", "getFieldSetData",
        "createRecord", "updateRecord", "deleteRecord",
        "getRecordTypes", "getRecordTypesMap",
        "getPicklistValues", "executeQuery"
    ],
    getDataService: function(cmp){ 
        if($A.util.isEmpty(this.dataServiceWrapper)) this.getDataServiceWrapper(); 
        if(!this.isDataServiceAvailable()){
            this.initDataService(cmp).then(this.initDataServicePendingRequests);
        }
        return this.dataServiceWrapper;  
    },
    isDataServiceAvailable: function(){
        return !!this.dataService;
    },
    getDataServiceWrapper: function(){
        this.dataServiceMethods.forEach((method) => {
            this.dataServiceWrapper[method] = (params) => {
                var defer = this.deferred();
                defer.promise.then(
                    this.getAuraCallback(params.onSuccess, params.context),
                    this.getAuraCallback(params.onError, params.context)
                );
                params.onSuccess = defer.resolve; params.onError = defer.reject;
                this.pendingDataServiceRequests[method] = params;
                this.initDataServicePendingRequests();
                return defer.promise;
            };
        }, this);
    },
    initDataServicePendingRequests: function(){
        if(this.isDataServiceAvailable() && !$A.util.isEmpty(this.pendingDataServiceRequests)){
            for(var name in this.pendingDataServiceRequests){
                var method = this.dataService[name], params = this.pendingDataServiceRequests[name];
                if(method && params) method(params); this.pendingDataServiceRequests[name] = null;
            }
        }
    },
    initDataService: function(cmp) {
        var defer = this.deferred();
        if(!this.isDataServiceAvailable()){
            this.fireComponentEvent(cmp, "initDataServiceEvent", {
                params: {
                    handler: (dataService) => {
                        this.dataService = dataService; defer.resolve(); 
                    }
                }
            });
        } else defer.resolve();
        return defer.promise;
    },

    //utility methods
    navigateToComponent: function(cmp, cmpName, recordId, state){
		recordId = recordId || this.getRecordId(cmp); state = state || this.getState(cmp);
        this.fireComponentEvent(cmp, "navigateToComponentEvent", { cmpName: cmpName, recordId: recordId, state: state });
	},
    navigateToPreviousComponent: function(cmp, state){
        this.fireComponentEvent(cmp, "navigateToPreviousComponentEvent", { state: this.extend(this.getState(cmp), state) });
    },
    refreshComponent: function(cmp, recordId, state){ 
        var name = cmp.getName(); if(name.startsWith("c")) name = name.replace("c", "");
        this.navigateToComponent(cmp, name, recordId, this.extend(this.getState(cmp), state));
    },
    refreshView: function(cmp){ 
        var name = cmp.getName(); if(name.startsWith("c")) name = name.replace("c", "");
        this.fireApplicationEvent("RefreshView", { cmpName: name });
        this.fireApplicationEvent("force:refreshView");
    },

    //page header utility methods
    enableDisableHeader: function(cmp, enable){
        enable = $A.util.isUndefinedOrNull(enable) ? cmp.get("v.enableHeader") : enable;
        cmp.set("v.enableHeader", enable); return enable;
    },
    enableDisableBack: function(cmp, enable){
        enable = $A.util.isUndefinedOrNull(enable) ? cmp.get("v.enableBack") : enable;
        cmp.set("v.enableBack", enable); return enable;
    },
    setHeaderDetails: function(cmp, title, subtitle){
        if(title) cmp.set("v.title", title);
        if(subtitle) cmp.set("v.subtitle", subtitle);
    },
    setHeaderActions: function(cmp, actions, handler, context){
        handler = this.getAuraCallback(handler, context, cmp);
        actions = this.ensureArray(actions);
        actions.forEach((action) => { action.handler = action.handler || handler; });
        this.setActions(cmp, actions);
    },

    //field set data utility methods
    getFieldSetDataItem: function(fieldSetData, recordId){
        if(fieldSetData){
            for(var i = 0; i < fieldSetData.length; i++){
                var fieldSetDataItem = fieldSetData[i];
                if(fieldSetDataItem.recordId === recordId) return fieldSetDataItem;
            }
        }
    },
    getFieldSetItemRecordValue: function(fieldSetDataItem, fieldName){
        if(fieldSetDataItem && fieldSetDataItem.recordValues){
            for(var i = 0; i < fieldSetDataItem.recordValues.length; i++){
                var recordValue = fieldSetDataItem.recordValues[i];
                if(recordValue.name === fieldName) return recordValue;
            }
        }
    },

    //other utility methods
    log: function(cmp){ 
        console.log.apply(console, this.extend([cmp.getName()], this.rest(arguments, 1))); 
    },
    error: function(cmp){ 
        console.error.apply(console, this.extend([cmp.getName()], this.rest(arguments, 1))); 
    },
    getAuraCallback: function(callback, context){ 
        var args = this.rest(arguments, 2);
        callback = this.callback(callback, context);
        return this.auraCallback(function(){ 
            callback.apply(null, args.concat(this.rest(arguments))); 
        });
    },
    setTimeout: function(callback, time, context, cmp){ 
        this.delay(this.getAuraCallback(callback, context, cmp), time || 0);
    },
    fireApplicationEvent: function(name, params){
        name = name.replace("e.", ""); name = "e." + (name.includes(":") ? name : "c:" + name); 
        var event = $A.get(name); if(event) { event.setParams(params || {}); event.fire(); return true; }
    },
    fireComponentEvent: function(cmp, name, params){
        var event = cmp.getEvent(name);
        if(event) { event.setParams(params || {}); event.fire(); return true; }
    },
    showHideDiv: function(cmp, auraId, show){
        auraId = this.isString(auraId) ? auraId : this.map(auraId, String);
        if(this.isArray(auraId)){
            this.each(auraId, this.partial(this.showHideDiv, cmp, this, show));
        } else {
            $A.util.addClass(cmp.get(auraId), show ? "slds-show" : "slds-hide");
            $A.util.removeClass(cmp.get(auraId), show ? "slds-hide" : "slds-show");
        }
    },
    showToast: function(mode, message, type) {
        message = this.stringifyJSON(message);
        mode = this.isNotEmpty(mode) ? mode : 'dismissible'; type = this.isNotEmpty(type) ? type : 'error';
        var params = { type: type, mode: mode, message: message, messageTemplate: "{0}", messageTemplateData: [message] };
        this.fireApplicationEvent("force:showToast", params) || alert(message);
    },
    showInfoToast: function(message) { 
        this.showToast(null, message, 'info'); 
    },
    showSuccessToast: function(message) { 
        this.showToast(null, message, 'success'); 
    },
    showErrorToast: function(message) {
        this.showToast(null, message, 'error'); 
    },
    showHideSpinner: function(cmp, show){ 
        this.fireApplicationEvent("ShowHideSpinner", { show: show }); 
    },
    showSpinner: function(cmp){ 
        this.showHideSpinner(cmp, true); 
    },
    hideSpinner: function(cmp){ 
        this.showHideSpinner(cmp, false) 
    },
    createComponent: function(cmpName, params, callback, context){
        cmpName = cmpName.includes(":") ? cmpName : 'c:' + cmpName;
        callback = this.getAuraCallback(callback, context);
        $A.createComponent(cmpName, params, ((newCmp, status, error) => {
            if (status === "SUCCESS") callback(newCmp);
            else this.showErrorToast(error);
        }).bind(this));
    },
    parseJSON: function(data, defaultValue){
        if(this.isString(data)) return JSON.parse(data); 
        else if(this.isUndefinedOrNull(data)) return defaultValue;
        else return data;
    },
    stringifyJSON: function(data){
        if(this.isUndefinedOrNull(data)) return '';
        else if(!this.isString(data)) return JSON.stringify(data, null, '\t'); 
        else return data;
    },
    ensureArray: function(list){ 
        return (this.isArray(list) ? list : (!this.isUndefinedOrNull(list) ? [list] : [])); 
    },
    getServerAction: function(cmp, method, params, callback, context){
        method = method.includes(".") ? method : 'c.' + method;
        callback = this.getAuraCallback(callback, context, cmp);
        var action = cmp.get(method);
        action.setParams(params || {});
        action.setCallback(this, function(response) { 
            this.hideSpinner(cmp);
            if (cmp.isValid() && response.getState() === "SUCCESS") {
                callback(response.getReturnValue());
            } else if (response.getState() === "ERROR") {
                let errors = response.getError();
                let message = 'Unknown error'; 
                if (this.isArray(errors) && this.isNotEmpty(errors)) {
                    message = errors[0].message;
                }
                this.error(cmp, "Server Error: " + method, message, params);
                this.showErrorToast(message);
            }
        });
        return action;
    },
    executeServerAction: function(cmp, method, params, callback, context){
        $A.enqueueAction(this.getServerAction(cmp, method, params, callback, context));
    },
    enqueueAction: function(enqueueCallback, cmp, method, params, callback, context){
        this.showSpinner(cmp); enqueueCallback(this.getServerAction(cmp, method, params, callback, context));
    }
})