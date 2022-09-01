define(['./lib/opportunity', './lib/estimate','./lib/visa','./lib/stateofregistration'],

function(opportunity, estimate,visa,stateofregistration) {
	
	getOpportunity = function(option){
	
		return opportunity.getRecord(option);
		
	};
	
	getEstimate = function(option){
		
		return estimate.getRecord(option);
		
	};

	getVisa = function(option){

		return visa.getRecord(option);

	};

	getStateOfRegistration = function(option){

		return stateofregistration.getRecord(option);

	};
	
    return {
    	getOpportunity: getOpportunity,
    	getEstimate: getEstimate,
		getVisa:getVisa,
		getStateOfRegistration:getStateOfRegistration
    };
    
});
