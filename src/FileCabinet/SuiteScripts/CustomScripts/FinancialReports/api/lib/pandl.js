define(['N/runtime', '../../../SuiteTable/api/suitetable', '../../../Library/momentjs/moment'],
/**
 * @param {suitetable} suitetable
 */
function(runtime, suitetable, moment) {
   
	get = function(option){

		var idMe = runtime.getCurrentUser().id;
		var sParamFilter = '';
		
		var objUserFilter = {
			'8972': 'AND transactionline.class = 85',
			'5682': 'AND transactionline.class = 86',
			'553': 'AND transactionline.class = 87',
			'8755': 'AND transactionline.class = 90',
			'-5': 'AND transactionline.class = 88',
		};
		
		var objLobFilter = {
			'ps': 'AND transactionline.class = 85',
			'ms': 'AND transactionline.class = 86',
			'apps': 'AND transactionline.class = 87',
			'resell': 'AND transactionline.class = 90',
			'learndot': 'AND transactionline.class = 88',
		};
		
		if(option.type == 'mylob'){
			sParamFilter = objUserFilter[idMe];
		}
		else if(option.type != 'mylob' && option.type != undefined){
			sParamFilter = objLobFilter[option.type];
		}
		
		var arrData = suitetable.getData({
			sqlfile: 'SuiteScripts/CustomScripts/FinancialReports/sql/pandl.sql',
			custparam : {
				paramfilter: sParamFilter
			}
		});
	
		var nMonths = 12;
		
		for (var nHeader = 2; nHeader < arrData.header.length ; nHeader++) {
			arrData.header[nHeader].title = moment().startOf('month').subtract(nMonths, 'months').format("YYYY.MM");
			nMonths--;
		}

		return arrData;
	};
	
    return {
        get: get
    };
    
});
