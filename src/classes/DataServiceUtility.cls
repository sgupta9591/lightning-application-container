/*------------------------------------------------------------------------------------
Author:        Sumit Gupta
Company:       Salesforce
Description:   data service utility class for data service lighning component 

History
Date            Author             Comments
--------------------------------------------------------------------------------------
01-03-2018     Sumit Gupta       	Initial Release
------------------------------------------------------------------------------------*/

public without sharing class DataServiceUtility {

	public static SObject getRecord(Id recordId, Set<String> fields, String whereClause) {
		whereClause = (!String.isBlank(whereClause) ? whereClause : '').remove('WHERE').trim();
		whereClause = 'Id = \'' + recordId + '\'' + (!String.isBlank(whereClause) ? ' AND ' + whereClause : '');
		String query = MetadataServiceUtility.buildQuery(getObjectNameFromId(recordId), null, fields, whereClause);
		return Database.query(query).get(0);
	}

	public static List<SObject> getRecords(String objectName, Set<String> fields, String whereClause) {
		String query = MetadataServiceUtility.buildQuery(objectName, null, fields, whereClause);
		query += ' ORDER BY Name'; return Database.query(query);
	}

	public static list<MetadataServiceUtility.FieldSetDataWrapper> getFieldSetData(String objectName, String fieldSetName, String whereClause) {
		fieldSetName = !String.isBlank(fieldSetName) ? fieldSetName : 'Compact_Layout';
		return MetadataServiceUtility.getFieldSetData(objectName, fieldSetName, whereClause);
	}

	public static String createRecord(String objectName, Map<String, Object> defaultFieldValues) {
		Sobject newRecordFromSobject = getNewRecordFromObjectName(objectName);
		SObject record = setFieldValues(newRecordFromSobject, defaultFieldValues);
		insert record; 
		return record.Id;
	}

	public static String updateRecord(String recordId, Map<String, Object> fieldValues) {
		SObject record = setFieldValues(getNewRecordFromObjectName(getObjectNameFromId(recordId)), fieldValues);
		record.Id = recordId; update record; return record.Id;
	}

	public static void deleteRecord(Id recordId) {
		delete recordId.getSObjectType().newSObject(recordId);
	}

	public static String getObjectNameFromId(Id recordId) {
		return recordId.getSObjectType().getDescribe().getName();
	}

	public static SObject getNewRecordFromObjectName(String objectName) {
		return Schema.getGlobalDescribe().get(objectName).getDescribe().getSobjectType().newSObject();
	}

	public static SObject setFieldValues(SObject record, Map<String, Object> fieldValues) {
		if(fieldValues != null) {
			for(String key : fieldValues.keySet()) {
				record.put(key, fieldValues.get(key));
			}
		} 
		return record;
	}

	public static SObject cloneRecord(Sobject record){
		return record.clone(false, false, false, false);
	}

	public static List<SObject> getRecordTypes(String objectName){
		return getRecords('RecordType', new Set<String>{'Name', 'DeveloperName'}, 'SobjectType = \'' + objectName + '\'');
	}

	public static List<MetadataServiceUtility.PicklistValue> getPicklistValues(String objectName, String fieldName){
		return MetadataServiceUtility.getPicklistValues(objectName, fieldName);
	}
}