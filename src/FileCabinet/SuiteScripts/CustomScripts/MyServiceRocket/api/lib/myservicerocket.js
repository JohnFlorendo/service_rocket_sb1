define(['N/file', 'N/query'],

function(file, query) {
   
	get = function (option){
		
		//get MyServiceRocket with parameter of page


		
		//Return JSON from SQL
		return;
	};
	
	hasPermission = function(option) {
		
		//get MyServiceRocket with parameter of user and page

		var custParam = option.custparam;
		
    	var regx = new RegExp(Object.keys(custParam).join("|"),"gi");
		var sSql = file.load({
			id: '../../sql/myservicerocket.sql'
		}).getContents();
		
	        sSql = sSql.replace(regx, function(matched){
	  		  return custParam[matched];
	  		});
		
    	var arrApps = query.runSuiteQL({
			query: sSql
		}).asMappedResults();
    	
    	///return boolean
    	if(arrApps.length >0){
    		return true;
    	}
    	else {
    		return false;
    	}

	};
	
    return {
    	get: get,
    	hasPermission: hasPermission
    };
    
});
