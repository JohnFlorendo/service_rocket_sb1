define(['N/query', 'N/file', '../../../SuiteTable/api/suitetable'],

function(query, file, suitetable) {
	
	getList = function(option){
		
		var objData;
		var arrTimeoff = [];
		var idLast = 0;
		
		do {

			var arrResult = suitetable.getData({
				sqlfile: 'SuiteScripts/CustomScripts/RecordViewer/sql/peopletimeoffbalance.sql'
			});

			objData = arrResult;
			
			arrTimeoff = arrTimeoff.concat(arrResult.data);
			idLast = arrResult.data[arrResult.data.length -1][9];

		} while (arrResult.data.length >= 5000);
		
		
		objData.data = arrTimeoff;
		
		return objData;
		
	};
   
    return {
    	getList: getList,
    };
    
});
