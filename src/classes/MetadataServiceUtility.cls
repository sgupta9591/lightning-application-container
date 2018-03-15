/*------------------------------------------------------------------------------------
Author:      	Sumit Gupta
Company:     	Salesforce
Description: 	Metadata utility methods

History
Date            Author             Comments
--------------------------------------------------------------------------------------
01-03-2018     Sumit Gupta         Initial Release
------------------------------------------------------------------------------------*/

public class MetadataServiceUtility {

	//Method to build query string based on field set, additional fields and where clause
    public static String buildQuery(String objectName, String fieldSetName, Set<String> additionalFields, String whereClause) {
        Set<String> fields = getFieldsFromFieldSet(objectName, fieldSetName);
        if(additionalFields != null) fields.addAll(additionalFields); 
        if(fields.isEmpty()) fields.add('Id');
        whereClause = (!String.isBlank(whereClause) ? whereClause : '').remove('WHERE').trim();
     	return 'SELECT ' + String.join(new List<String>(fields), ',') + ' FROM ' + objectName + (!String.isBlank(whereClause) ? (' WHERE ' + whereClause) : '');    
	}

    //Method to get fields from a field set
    public static Set<String> getFieldsFromFieldSet(String objectName, String fieldSetName) {
        Set<String> fields = new Set<String>();
        Schema.FieldSet fieldSet = getFieldSet(objectName, fieldSetName);
        if(fieldSet == null) return fields;
        for(Schema.FieldSetMember fieldSetMember :fieldSet.getFields()) {
            if(!fields.contains(fieldSetMember.getFieldPath())){
                fields.add(fieldSetMember.getFieldPath()); 
            }   
        }
        return fields;
    }

    //Method to read and create schema based on field set structure and object name  
    public static Schema.FieldSet getFieldSet(String objectName, String fieldSetName){ 
        Schema.FieldSet fieldSet;
        if(objectName != null && fieldSetName != null){
            Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe(); 
            if(globalDescribe.containsKey(objectName)){
                fieldSet = globalDescribe.get(objectName).getDescribe().FieldSets.getMap().get(fieldSetName);
            }
        }
        return fieldSet;
    }
    
    //Method to build query string based on field set and where clause
    public static string getQuery(String objectName, String fieldSetName, String whereClause){
        String query;
        Schema.FieldSet fieldSet = getFieldSet(objectName, fieldSetName);
        if(fieldSet != null){
            query = 'SELECT ';
            for(Schema.FieldSetMember fieldSetMember :fieldSet.getFields()) {
                if(fieldSetMember.getFieldPath() == 'Name') continue;
                if(fieldSetMember.getType() == Schema.DisplayType.Reference){
                    String fieldName = fieldSetMember.getFieldPath();
                    if(fieldName == 'OwnerId' || fieldName == 'RecordTypeId' || fieldName == 'AccountId' || fieldName == 'CreatedById'){
                        query += fieldName.substring(0,fieldName.length()-2) +'.Name' + ', '; 
                    } else {
                        query += fieldName.substring(0, fieldName.length()-1) + 'r.Name' + ', ';        
                    }
                }
                query += fieldSetMember.getFieldPath() + ', ';
            }
            query += 'Id, Name ' + ' FROM ' + objectName;
            if(whereClause != null){
                query = query + ' WHERE ' + whereClause + ' ORDER BY CreatedDate DESC LIMIT 5000';
            }
        }
        return query;
    }

    //Method to get all updatable fields for an object
    public static Set<String> getUpdatableFields(String objectName){
        Set<String> fields = new Set<String>();
        Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe(); 
        if(globalDescribe.containsKey(objectName)){
            Map<String, Schema.SObjectField> fieldMap = globalDescribe.get(objectName).getDescribe().fields.getMap();
            for(String fname :fieldMap.keySet()){
                Schema.DescribeFieldResult field = fieldMap.get(fname).getDescribe();
                if(field.isUpdateable() || field.getType() == Schema.DisplayType.Reference) fields.add(fname); 
            }
        }
        return fields;
    }

    //Method to get all values of a picklist type field
    public static List<PicklistValue> getPicklistValues(String objectName, String fieldName) {
        List<PicklistValue> picklistValues = new List<PicklistValue>();
        Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe(); 
        if(globalDescribe.containsKey(objectName)){
        	Map<String, Schema.SObjectField> fieldMap = globalDescribe.get(objectName).getDescribe().fields.getMap();
            if(fieldMap.containsKey(fieldName)) {
            	Schema.DescribeFieldResult fieldResult = fieldMap.get(fieldName).getDescribe();
	            if(fieldResult.getType() ==  DisplayType.Picklist) {
	                List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();
	                for(PicklistEntry pe: picklistEntries) {
	                    picklistValues.add(new PicklistValue(pe.getLabel(), pe.getValue()));
	                }
	            }
            }
        }
        return picklistValues;
    }  

    public with sharing class PicklistValue {
		@AuraEnabled public String label;
	    @AuraEnabled public String value;
	    
	    public PicklistValue(String label, String value) {
	        this.label = label;
	        this.value = value;
	    }
	}
    
    //Method to create field set wrapper stucture
    public static List<FieldSetDataWrapper> getFieldSetData(String objectName, String fieldSetName, String whereClause){
        List<FieldSetDataWrapper> fieldSetData = new List<FieldSetDataWrapper>();
        String query = getQuery(objectName, fieldSetName, whereClause);
        if(query == null) return fieldsetData; query = query.replace(' DESC ', ' ASC ');
        for(SObject record :Database.query(query)){
            List<FieldLabelValueWrapper> fields = new List<FieldLabelValueWrapper>();
            for(Schema.FieldSetMember field : getFieldSet(objectName, fieldSetName).getFields()){
                String fname = field.getFieldPath(), flabel = field.getLabel();
                Schema.DisplayType ftype = field.getType();
                String refId, fvalue;
                if(ftype == Schema.DisplayType.Reference){
                    String referenceFieldName; 
                    if(fname == 'OwnerId' || fname == 'RecordTypeId' || fname == 'AccountId' || fname == 'CreatedById'){ 
                        referenceFieldName = fname.substring(0, fname.length()-2);
                    } else {
                        referenceFieldName = fname.substring(0, fname.length()-1) + 'r';
                    } 
                    SObject refObj = record.getSobject(referenceFieldName);
                    if(refObj != null){
                        fvalue = String.valueOf(refObj.get('Name'));
                        refId = String.valueOf(refObj.get('Id'));
                    } 
                }else{
                    fvalue = String.valueOf(record.get(fname));
                }
                fields.add(new FieldLabelValueWrapper(refId, fname, flabel, String.valueOf(ftype), fvalue));
            }
            fieldSetData.add(new FieldSetDataWrapper(record.Id, String.valueOf(record.get('Name')), fields));
        }
        return fieldSetData; 
    }
  
    public class FieldSetDataWrapper{
        public Id recordId;
        public String recordName;
        public String titleField {get;set;}
        public List<FieldLabelValueWrapper> recordValues;
        public Boolean hidden;
       
        public FieldSetDataWrapper(Id recordId, String recordName, List<FieldLabelValueWrapper> recordValues){
            this.recordId = recordId; this.recordName = recordName; this.recordValues = recordValues; 
            titleField = 'Name'; hidden = false;
        }
    }

    public class FieldLabelValueWrapper{
        public String id;
        public String name;
        public String label;
        public String type;
        public String value;
        public Boolean hidden;
        
        public FieldLabelValueWrapper(String id, String name, String label, String type, String value){
            this.id = id; this.name = name; this.label = label; this.type = type;
            this.value = value != null ? value : ''; hidden = false;
        }
    }
}