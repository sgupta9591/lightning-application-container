/*------------------------------------------------------------------------------------
Author:        Sumit Gupta
Company:       Salesforce
Description:   controller class for data service lightning component 

History
Date            Author             Comments
--------------------------------------------------------------------------------------
01-03-2018     Sumit Gupta       	Initial Release
------------------------------------------------------------------------------------*/

public without sharing class DataService_CC {

	public class DataServiceException extends Exception {}

    @AuraEnabled
    public static String getRecord(String recordId, List<String> fields, String whereClause){
    	try{
    		if(String.isBlank(recordId)) {
                throw new DataServiceException('recordId is required to fetch record');
            }
    		return JSON.serialize(DataServiceUtility.getRecord(recordId, new Set<String>(fields), whereClause));
    	} catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled
    public static String getRecords(String objectName, List<String> fields, String whereClause){
        try{
            if(String.isBlank(objectName)) {
                throw new AuraHandledException('objectName is required to fetch records');
            }
            return JSON.serialize(DataServiceUtility.getRecords(objectName, new Set<String>(fields), whereClause));
        } catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

	@AuraEnabled
    public static String getFieldSetData(String objectName, String fieldSetName, String whereClause){
    	try{
    		if(String.isBlank(objectName)) {
                throw new AuraHandledException('objectName is required to fetch field set data');
            }
    		return JSON.serialize(DataServiceUtility.getFieldSetData(objectName, fieldSetName, whereClause));
    	} catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled
    public static String createRecord(String objectName, Map<String, Object> defaultFieldValues) {
        try{
            if(String.isBlank(objectName)) {
                throw new AuraHandledException('objectName is required to create new record');
            }
            return DataServiceUtility.createRecord(objectName, defaultFieldValues);
        } catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled
    public static String updateRecord(String recordId, Map<String, Object> fieldValues) {
        try{
            if(String.isBlank(recordId)){
                throw new AuraHandledException('recordId is required to update record');
            }
            return DataServiceUtility.updateRecord(recordId, fieldValues);
        } catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteRecord(String recordId) {
        try{
            if(String.isBlank(recordId)) {
                throw new AuraHandledException('recordId is required to delete record');
            }
            DataServiceUtility.deleteRecord(recordId);
        } catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled
    public static String getRecordTypes(String objectName) {
        try{
            if(String.isBlank(objectName)) {
                throw new AuraHandledException('objectName is required to get record types');
            }
            return JSON.serialize(DataServiceUtility.getRecordTypes(objectName));
        } catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled
    public static String getPicklistValues(String objectName, String fieldName) {
        try{
            if(String.isBlank(objectName) || String.isBlank(fieldName)) {
                throw new AuraHandledException('fieldName is required to get picklist values');
            }
            return JSON.serialize(DataServiceUtility.getPicklistValues(objectName, fieldName));
        } catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled
    public static String executeQuery(String query){
        try{
            if(String.isBlank(query)) {
                throw new AuraHandledException('query is required to unlink execute query');
            }
            return JSON.serialize(Database.query(query));
        } catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }
}