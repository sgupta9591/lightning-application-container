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
    dataService: null, dataServiceWrapper: null, pendingDataServiceRequests: {},
    dataServiceMethods: [
        "getRecord", "getRecords", "getFieldSetData",
        "createRecord", "updateRecord", "deleteRecord",
        "getRecordTypes", "getRecordTypesMap",
        "getPicklistValues", "executeQuery"
    ],
    getDataService: function(cmp){ 
        if(this.isEmpty(this.dataServiceWrapper)) this.dataServiceWrapper = this.getDataServiceWrapper(); 
        if(this.isEmpty(this.dataService)) this.initDataService(cmp);
        return this.dataServiceWrapper;  
    },
    getDataServiceWrapper: function(){
        return this.reduce(this.dataServiceMethods, (wrapper, method) => { 
            wrapper[method] = this.partial(this.getDataServiceMethodWrapper, method); return wrapper; 
        }, {});
    },
    getDataServiceMethodWrapper: function(method, params){
        var defer = this.deferred();
        defer.promise.then(this.callback(params.onSuccess, params.context), this.callback(params.onError, params.context));
        params.onSuccess = defer.resolve; params.onError = defer.reject;
        this.pendingDataServiceRequests[method] = params;
        this.initDataServicePendingRequests();
        return defer.promise;
    },
    initDataService: function(cmp){
        var params = { params: { handler: this.compose(this.initDataServicePendingRequests, this.setDataService) } };
        this.fireComponentEvent(cmp, "initDataServiceEvent", params);
    },
    setDataService: function(dataService){
        this.dataService = dataService;
    },
    initDataServicePendingRequests: function(){
        if(this.isEmpty(this.dataService) || this.isEmpty(this.pendingDataServiceRequests)) return;
        this.pendingDataServiceRequests = this.map(this.pendingDataServiceRequests, (params, name) => {
            var method = this.dataService[name]; if(method && params) method(params); return null;
        });
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
        if(this.isBoolean(enable)) cmp.set("v.enableHeader", enable);
    },
    enableDisableBack: function(cmp, enable){
        if(this.isBoolean(enable)) cmp.set("v.enableBack", enable);
    },
    setHeaderDetails: function(cmp, title, subtitle){
        if(this.isString(title)) cmp.set("v.title", title);
        if(this.isString(subtitle)) cmp.set("v.subtitle", subtitle);
    },
    setHeaderActions: function(cmp, actions, handler, context){
        if(!this.isArray(actions)) return;
        handler = this.bind(handler, context, cmp);
        this.each(actions, (action) => { action.handler = action.handler || handler; });
        this.setActions(cmp, actions);
    },

    //field set data utility methods
    getFieldSetDataItem: function(fieldSetData, recordId){
        return this.findWhere(fieldSetData, { recordId: recordId });
    },
    getFieldSetItemRecordValue: function(fieldSetDataItem, fieldName){
        return this.findWhere(fieldSetDataItem.recordValues, { name: fieldName });
    },

    //other utility methods
    fireApplicationEvent: function(name, params){
        name = name.replace("e.", ""); name = "e." + (name.includes(":") ? name : "c:" + name); 
        var event = $A.get(name); if(event) { event.setParams(params || {}); event.fire(); return true; }
    },
    fireComponentEvent: function(cmp, name, params){
        var event = cmp.getEvent(name);
        if(event) { event.setParams(params || {}); event.fire(); return true; }
    },
    createComponent: function(cmpName, params){
        var defer = this.deferred();
        cmpName = cmpName.includes(":") ? cmpName : 'c:' + cmpName;
        $A.createComponent(cmpName, params, this.callback((newCmp, status, error) => {
            if (status === "SUCCESS") defer.resolve(newCmp);
            else { this.showErrorToast(error); defer.reject(error); }
        }));
        return defer.promise;
    },
    enqueueAction: function(enqueue, cmp, method, params){
        var defer = this.deferred(), action = cmp.get(method.includes(".") ? method : 'c.' + method); 
        if(this.isUndefinedOrNull(action)) defer.reject("No action found");
        defer.promise.then(null, this.partial(this.error, cmp,  "Server Error: " + method, this, params));
        action.setCallback(this, this.partial(this.parseServerResponse, this, defer.resolve, defer.reject));
        action.setParams(params || {}); enqueue(action); 
        return defer.promise;
    },
    parseServerResponse: function(response, resolve, reject){
        if (response.getState() === "SUCCESS") {
            resolve(response.getReturnValue());
        } else if (response.getState() === "ERROR") {
            let errors = response.getError();
            let message = 'Unknown error'; 
            if (this.isArray(errors) && this.isNotEmpty(errors)) {
                message = errors[0].message;
            }
            this.showErrorToast(message); reject(message);
        }
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
    }
})