({
    getActionHandler: function(cmp, actionId){
        var actions = this.ensureArray(this.getActions(cmp));
        for(var i = 0; i < actions.length; i++){
            var action = actions[i]; if(action.actionId === actionId) 
            return action.handler;
        }
    }
})