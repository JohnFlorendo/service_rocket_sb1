define(['N/record', 'N/file','N/query', 'N/currency', '../../../Employee/api/lib/employeetree'],

function(record, file, query, currency, employeetree) {
	
	next = function(option){
		
		var idRecord = option.recordid;
		var sRecord = option.record;
		var nAmount = option.amount;
		var nLevel = option.level;
		
		var sSql = file.load({
			id: '../../sql/approver.sql'
		}).getContents();
		
    	var custParam = {
			paramid: recordid,
			paramamount: nAmount,
			paramlevel: nLevel 
    	};
    	
    	var regx = new RegExp(Object.keys(custParam).join("|"),"gi");
        sSql = sSql.replace(regx, function(matched){
  		  return custParam[matched];
  		});
		
    	var arrMatrix = query.runSuiteQL({
			query: sSql
		}).asMappedResults();
    	
    	if(arrMatrix.length == 1){
    		
    		var objMatrix = arrMatrix[0];
    		
    		var rec = record.load({
    			type: sRecord,
    			id: idRecord,
    			isDynamic: true
    		});
    		
    		rec.setValue({
    			fieldId: objMatrix.approverfield,
    			value: objMatrix.nextapprover
    		});
    		
    		rec.setValue({
    			fieldId: objMatrix.levelfield,
    			value: objMatrix.approvallevel
    		});
    		
    		rec.save();
    	}
	};

	nextManager = function(option){
		var arrManagers = [];
		
		var sSql = file.load({
			id: '../../sql/approvermanager.sql'
		}).getContents();

		var arrResults = employeetree.getManagers({
			id: option.employee
		});

		for (var indx = 0; indx < arrResults.length; indx++){
			var element = arrResults[indx];
			if (element != null) {
				arrManagers.push(element);
			}
		}

		log.audit('arrManagers',arrManagers)
		if(arrManagers.length<1){
			return undefined;
		}

		log.audit('nextManager option',option)
    	var custParam = {
    		parammatrix: option.matrix, 
    		paramrecord: option.record,
    		paramapprovers: arrManagers,
			paramamount: option.amount
    	};

    	var regx = new RegExp(Object.keys(custParam).join("|"),"gi");
        sSql = sSql.replace(regx, function(matched){
  		  return custParam[matched];
  		});

    	var arrMatrix = query.runSuiteQL({
			query: sSql
		}).asMappedResults();
    	log.audit('arrMatrix', arrMatrix);
    	
    	if(arrMatrix.length > 0){
    		var objMatrix = arrMatrix[0];
    		return objMatrix;
    	}
	};
	
	checkApprover = function(option){
		
		var sSql = file.load({
			id: '../../sql/approvermanager.sql'
		}).getContents();
		
		var arrManagers = employeetree.getManagers({
			id: option.employee
		});
		
    	var custParam = {
    		paramrecord: option.record,
    		paramapprovers: arrManagers,
			paramamount: option.amount
    	};
    	
    	var regx = new RegExp(Object.keys(custParam).join("|"),"gi");
        sSql = sSql.replace(regx, function(matched){
  		  return custParam[matched];
  		});
		
    	var arrMatrix = query.runSuiteQL({
			query: sSql
		}).asMappedResults();
    	
    	if(arrMatrix.length > 0){
    		var objMatrix = arrMatrix[0];
    		return objMatrix;
    	}
	};
	
	reset = function(option){
		
		var idRecord = option.recordid;
		var sRecord = option.record;
		
		var rec = record.load({
			type: sRecord,
			id: idRecord,
			isDynamic: true
		});
		
	};
	
    return {
        next: next,
        nextManager: nextManager,
        reset: reset
    };
    
});
