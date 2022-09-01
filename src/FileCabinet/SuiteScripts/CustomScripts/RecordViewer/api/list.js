define(['./lib/opportunity', './lib/estimate', './lib/peopletimeoffbalance.js','./lib/visa','./lib/stateofregistration'],

function(opportunity, estimate, peopletimeoffbalance,visa,stateofregistration) {

	getVisaList = function(option){

		return visa.getList(option);

	};

	getStateOfRegistrationList = function(option){

		return stateofregistration.getList(option);

	};

	getOpportunityList = function(option){
	
		return opportunity.getList(option);
		
	};
	
	getOpportunityItems = function(option){
		
		return opportunity.getItems(option);
		
	};
	
	getOpportunityRelatedRecords = function(option){
		
		return opportunity.getRelatedRecords(option);
		
	};
	
	getEstimateList = function(option){
		
		return estimate.getList(option);
		
	};
	
	getEstimateItems = function(option){
		
		return estimate.getItems(option);
		
	};
	
	getEstimateRelatedRecords = function(option){
		
		return estimate.getRelatedRecords(option);
		
	};
	
	getPeopleTimeoffBalance = function(option){
		
		return peopletimeoffbalance.getList(option);
		
	};
	
    return {
    	getOpportunityList: getOpportunityList,
    	getOpportunityItems: getOpportunityItems,
    	getOpportunityRelatedRecords: getOpportunityRelatedRecords,
    	getEstimateList: getEstimateList,
    	getEstimateItems: getEstimateItems,
    	getEstimateRelatedRecords: getEstimateRelatedRecords,
    	getPeopleTimeoffBalance: getPeopleTimeoffBalance,
		getVisaList:getVisaList,
		getStateOfRegistrationList:getStateOfRegistrationList
    };
    
});
