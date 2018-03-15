/*------------------------------------------------------------------------------------
Author:        Sumit Gupta
Company:       Salesforce
Description:   controller class for data service lightning component 

History
Date            Author             Comments
--------------------------------------------------------------------------------------
04-03-2018     Sumit Gupta       	Initial Release
------------------------------------------------------------------------------------*/
@isTest
private class DataServiceControllerTest {
	
	@isTest static void test_dataServiceUtility() {
		String accountId = DataService_CC.createRecord('Account', new Map<String, Object> { 'Name' => 'Test Account' });
		System.assertNotEquals(accountId, null);

		String success1 = DataService_CC.getRecords('Account', new List<String>{ 'Name' }, 'Name = \'Test Account\'');
		System.assertNotEquals(success1, null);

		String success2 = DataService_CC.getRecord(accountId, new List<String>{ 'Name' }, 'Name = \'Test Account\'');
		System.assertNotEquals(success2, null);

		String success3 = DataService_CC.updateRecord(accountId, new Map<String, Object>());
		System.assertNotEquals(success3, null);

		String success4 = DataService_CC.getRecordTypes('Account');
		System.assertNotEquals(success4, null);

		String success5 = DataService_CC.getPicklistValues('Account', 'Type');
		System.assertNotEquals(success5, null);

		String success6 = DataService_CC.executeQuery('SELECT Id FROM Account');
		System.assertNotEquals(success6, null);

		DataService_CC.getFieldSetData('Account', 'Compact_Layout', null);
		DataService_CC.deleteRecord(accountId);

		DataServiceUtility.cloneRecord((Account)JSON.deserialize(success2, Account.class));
		MetadataServiceUtility.getUpdatableFields('Account');
		new MetadataServiceUtility.FieldSetDataWrapper(null, null, null);
		new MetadataServiceUtility.FieldLabelValueWrapper(null, null, null, null, null);

		try{
			String failure1 = DataService_CC.createRecord(null, null);
			System.assertEquals(failure1, null);
		} catch (Exception ex1){
			try{
				String failure2 = DataService_CC.getRecords(null, null, null);
				System.assertEquals(failure2, null);
			} catch (Exception ex2){
				try{
					String failure3 = DataService_CC.getRecord(null, null, null);
					System.assertEquals(failure3, null);
				} catch (Exception ex3){
					try{
						String failure4 = DataService_CC.updateRecord(null, null);
						System.assertEquals(failure4, null);
					} catch (Exception ex4){
						try{
							String failure5 = DataService_CC.getRecordTypes(null);
							System.assertEquals(failure5, null);
						} catch (Exception ex5){
							try{
								String failure6 = DataService_CC.getPicklistValues(null, null);
								System.assertEquals(failure6, null);
							} catch (Exception ex6){
								try{
									String failure7 = DataService_CC.executeQuery(null);
									System.assertEquals(failure7, null);
								} catch (Exception ex7){
									try{
										DataService_CC.deleteRecord(null);
									} catch (Exception ex8){
										try{
											DataService_CC.getFieldSetData(null, null, null);
										} catch (Exception ex9){
											System.debug(ex9.getMessage());
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}