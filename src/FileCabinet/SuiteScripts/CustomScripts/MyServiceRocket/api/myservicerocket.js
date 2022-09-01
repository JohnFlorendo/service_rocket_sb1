define(['./lib/myservicerocket', './lib/myapps'],

function(myservicerocket, myapps) {
	
	hasMySrPermission = function(option){
		
		return myservicerocket.hasPermission (option);
	};
	
	getMyApps = function(option){
		return myapps.get (option);
	};

	getMyAppsByGroup = function(option){
		return myapps.getByGroup (option);
	};
	
	hasMyAppsPermission = function(option){
		
		return myapps.hasPermission (option);
	};

	getMyAppsDataPermission = function(option){

		return myapps.getDataPermission (option);
	};
   
    return {
    	hasMySrPermission: hasMySrPermission,
    	getMyApps: getMyApps,
    	hasMyAppsPermission: hasMyAppsPermission,
		getMyAppsByGroup:getMyAppsByGroup,
		getMyAppsDataPermission:getMyAppsDataPermission
    };
    
});
