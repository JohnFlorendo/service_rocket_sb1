/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/file', 'N/redirect', 'N/task', 'N/runtime'
	, '../../MyServiceRocket/api/myservicerocket'
	, '../api/estimate'
	, '../api/invoice'
	, '../api/letter'
	, '../api/lib/promotionletter'
	, '../api/listpdf'
	,'../api/jobdescription'
	, '../api/lib/scopingdoc'
],

function(record, file, redirect, task, runtime, myservicerocket, estimate, invoice, letter, promotionletter, listpdf, jobdesc, scopingdoc) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
	
	
    function onRequest(context) {
    	
     	var paramReq = context.request.parameters;
		var idMe = runtime.getCurrentUser().id;
    	var idRec = paramReq.id;
    	var sType = paramReq.type;
    	var sPdfTemplate = '';
    	
    	if(sType == 'estimate'){
    		
    		recPrint = record.load({	type: sType, 
										id: idRec, 
										isDynamic: true});
    		sPdfTemplate = estimate.generate(recPrint);
    		
    		context.response.setHeader({
          		name: 'Content-disposition',
          		value: 'filename="' + recPrint.getValue({fieldId: 'tranid'}) + '_'+  recPrint.getValue({fieldId: 'custbody_atl_quote_number'}) + '.pdf"',
        	});
    		context.response.renderPdf(sPdfTemplate);
    	}
    	else if(sType == 'invoice'){
    		
    		recPrint = record.load({	type: sType, 
							id: idRec, 
							isDynamic: true});
			sPdfTemplate = invoice.generate(recPrint);
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename="' + recPrint.getValue({fieldId: 'tranid'}) + '_'+  recPrint.getText({fieldId: 'entity'}) + '.pdf"',
			});
			context.response.renderPdf(sPdfTemplate);
    	}
    	else if(sType == 'promotionletter'){
    		
			var objFile = promotionletter.generate({id: idRec});
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename='+objFile.name+'.pdf',
			});
			
			sPdfTemplate = objFile.file;
			context.response.renderPdf(sPdfTemplate);
    	}
    	else if(sType == 'promotioncycle'){
    		
    		var tskPromoCycle = task.create({
    	        taskType: task.TaskType.MAP_REDUCE,
    	        scriptId: 'customscript_cust_promocycleupload_mr',
    	        deploymentId: 'customdeploy_cust_promocycleupload_mr',
    	        params : {
    	                'custscript_promocycleid' : idRec
    	            }
    	    });
    		
    		var tskIdPromoCycle = tskPromoCycle.submit();
    		 
    		redirect.toRecord({
                type: 'customrecord_sr_promocycle',
                id: idRec
            });
    	}
    	else if(sType == 'salaryadjustmentletter'){
    		
			var objFile = letter.generateSalaryAdjustment({id: idRec});
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename='+objFile.name+'.pdf',
			});
			
			sPdfTemplate = objFile.file;
			context.response.renderPdf(sPdfTemplate); 
    	}
    	else if(sType == 'adjustmentcycle'){
    		
    		var tskAdjustmentCycle = task.create({
    	        taskType: task.TaskType.MAP_REDUCE,
    	        scriptId: 'customscript_adjustmentcycleupload_mr',
    	        deploymentId: 'customdeploy_adjustmentcycleupload_mr',
    	        params : {
    	                'custscript_addjustmentcycleid' : idRec
    	            }
    	    });
    		
    		var tskIdAdjustmentCycle = tskAdjustmentCycle.submit();
    		 
    		redirect.toRecord({
                type: 'customrecord_sr_adjustmentcycle',
                id: idRec
            });
    	}
    	else if(sType == 'termsconditions'){
    		
    		
			var hasPermission = myservicerocket.hasMyAppsPermission({
				custparam: {
					paramuser: idMe,
					paramapps: 'peopleletter'
				}
			});

			if (hasPermission) {
    			
    			var objFile = letter.generateTermsCondition({id: idRec});
    			
    			context.response.setHeader({
    				name: 'Content-disposition',
    				value: 'filename=ServiceRocketT&C.pdf',
    			});
    			
    			sPdfTemplate = objFile.file;
    			context.response.renderPdf(sPdfTemplate); 
    		}
    	}
    	else if(sType == 'offerletter'){
    		
			var hasPermission = myservicerocket.hasMyAppsPermission({
				custparam: {
					paramuser: idMe,
					paramapps: 'peopleletter'
				}
			});

			if (hasPermission) {
    			 
				var objFile = letter.generateOffer({id: idRec});
				
				context.response.setHeader({
				name: 'Content-disposition',
				value: 'filename='+objFile.name+'.pdf',
				});
				
				sPdfTemplate = objFile.file;
				context.response.renderPdf(sPdfTemplate); 
    		 }
    	}
    	else if(sType == 'subsidiaryallowance'){
    		
			var objFile = letter.generateSubsidiaryAllowance({});
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename='+objFile.name+'.pdf',
			});
			
			sPdfTemplate = objFile.file;
			context.response.renderPdf(sPdfTemplate); 
    	}
    	else if(sType == 'allowancetable'){
    		
			var sPdfTemplate = listpdf.generateAllowanceTable();
			context.response.renderPdf(sPdfTemplate); 
    	}
      	else if(sType == 'jobdescription'){
			try{
			context.response.writeFile({
				file : jobdesc.generate({jobid:idRec}),
				isInline : true
			});
			}catch(e){
			log.debug('Error creating job description PDF', e)
			}
      	}
		else if(sType == 'scopingdoc'){

			var objFile = scopingdoc.generatePDF({id: idRec});
	
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename='+objFile.name+'.pdf',
			});
			
			sPdfTemplate = objFile.content;
			context.response.renderPdf(sPdfTemplate); 

      	}
		else if(sType == 'scopingdocganttchart'){

			var objFile = scopingdoc.generateGanttChart({id: idRec});
			sPdfTemplate = objFile.content;
			context.response.write(sPdfTemplate);

      	}
    }

    return {
        onRequest: onRequest
    };
    

});
