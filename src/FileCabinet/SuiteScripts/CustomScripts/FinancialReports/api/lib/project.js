define(['../../../SuiteTable/api/suitetable', '../../../Library/momentjs/moment'],
/**
 * @param {suitetable} suitetable
 */
function(suitetable, moment) {

	get = function(option){

		var sSql = 'projectrevenue.sql';

		if(option.currencyrate == 'local'){
			sSql = 'projectrevenuelocal.sql';
		}
		else if(option.currencyrate == 'average'){
			sSql = 'projectrevenueaverage.sql';
		}
//		else if(option.currencyrate == 'current'){
//			sSql = 'projectrevenuecurrent.sql';
//		}

		var arrData = suitetable.getData({
			sqlfile: 'SuiteScripts/CustomScripts/FinancialReports/sql/' + sSql,
			custparam: {
				paramtodate: moment().startOf('month').format("DD-MM-YYYY")
			}
		});

		var nMonths = 1;

		for (var nHeader = 3; nHeader < arrData.header.length -1; nHeader++) {
			arrData.header[nHeader].title = moment().startOf('month').subtract(nMonths, 'months').format("YYYY.MM");
			nMonths++;
		}

		return arrData;
	};

	getByProject = function(option){

		var arrDataConsolidated = [];

		var sSql = 'revcontribyproject.sql';

		var arrData = suitetable.getData({
			sqlfile: 'SuiteScripts/CustomScripts/FinancialReports/sql/' + sSql,
			custparam: {
				paramtodate: moment().startOf('month').format("DD-MM-YYYY")
			}
		});

		arrData.data.forEach(function (data){
			var objData = {}
			for(var arrIdx = 0; arrIdx < arrData.header.length; arrIdx++){
				objData[arrData.header[arrIdx].title] = data[arrIdx]
			}
			arrDataConsolidated.push(objData)
		});
		log.audit('arrDataConsolidated', arrDataConsolidated);

		var nMonths = 1;
		var objPreviousMonths = {};

		for (var nHeader = 2; nHeader < arrData.header.length; nHeader++) {
			if (nHeader % 2 == 0) {
				arrData.header[nHeader].title = moment().startOf('month').subtract(nMonths, 'months').format("YYYY.MM");

                objPreviousMonths['dtMonth' + nMonths] = arrData.header[nHeader].title;
				nMonths++;
			}
		}
        log.audit('objPreviousMonths', objPreviousMonths);

		return {arrDataConsolidated: arrDataConsolidated, objPreviousMonths: objPreviousMonths};
	};

    return {
        get: get,
		getByProject: getByProject
    };

});
