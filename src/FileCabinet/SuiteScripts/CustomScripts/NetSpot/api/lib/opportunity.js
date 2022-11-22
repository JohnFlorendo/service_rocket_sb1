define(['N/record', 'N/query', 'N/https' , './company', './deal', './customer', '../../../Helper/jsonmapns'],
/**
 * @param {record} record
 * @param {query} query
 * @param {https} https
 */
		
function(record, query, https, company, deal, customer, jsonmapns) {
   
	create = function(option){
		
		var retMe = {
			request: option
		};
        
		var nsptDeal = deal.get({ 
			id: option.id,
			properties: ['dealname', 'amount', 'deal_currency_code', 'nssubsidiary', 'nsclass', 'hubspot_owner_id', 'partner_practice']
		});
        
		var objDeal = {};
		var objCompany = {};
		
		if(nsptDeal.status == 'SUCCESS'){
			
			objDeal = nsptDeal.response.data;
			//objDeal.properties.deal_currency_code = 'USD';
			
	        if(objDeal.associations){
	        	
	        	objDeal.properties.customerid = objDeal.associations.companies.results[0].id; 
	        	
	        	var nsptCompany = company.get({
	        		id: objDeal.properties.customerid, 
	        		properties: ['name', 'domain', 'nsid', 'nssubsidiary', 'address', 'address2', 'city', 'state', 'country', 'zip']	
	        	});

	        	
	            if(nsptCompany.status == 'SUCCESS'){
	            	
	            	objCompany = nsptCompany.response.data;
	            	
	            	if(objCompany.properties.nsid){
	            		objDeal.properties.customernsid = objCompany.properties.nsid;
	            	}
	            	else{
	            		
	            		if(objCompany.properties.nssubsidiary == null){
	            			objCompany.properties.nssubsidiary = objDeal.properties.nssubsidiary;
	            		}

	            		objCompany.properties.deal_currency_code = objDeal.properties.deal_currency_code;
	            		
	            		var nsptCustomer = customer.create({
	            			data: objCompany,
	            			hasdata: true 
	            		});
	            		
	            		if(nsptCustomer.status == 'FAILED'){
	            			return nsptCustomer;
	            		}
	            		else if(nsptCustomer.status == 'SUCCESS'){
	            			objDeal.properties.customernsid = nsptCustomer.response.id;
	            		}
	            	}
	            }
	            else if (nsptCompany.status == 'FAILED'){
	    			return nsptCompany;
	            }
	        }
		}
		else if (nsptDeal.status == 'FAILED' ){
			return nsptDeal;
		}
		
        try {
        	
			var recMapping = record.load({
				type : 'customrecord_integration_mapping',
				id : 124
			});
			
			var objOppsMapping = JSON.parse(recMapping.getValue({
				fieldId : 'custrecord_intmap_mapping'
			}));
			
			var arrHsDeal = query.runSuiteQL('SELECT id FROM transaction WHERE custbody_hubspot_id = '+ option.id).asMappedResults();
			var recOpps;
			
			if (arrHsDeal.length > 0) {

				recOpps = record.load({
					type : record.Type.OPPORTUNITY,
					id : arrHsDeal[0].id,
					isDynamic : true
				});
			} 
			else {

				recOpps = record.create({
					type : record.Type.OPPORTUNITY,
					isDynamic : true
				});
			}
			
			for ( var key in objOppsMapping) {

				recOpps = jsonmapns.jsonMap({
					mapping : objOppsMapping,
					record : recOpps,
					data : objDeal,
					key : key
				});
			}
			
			if(recOpps.getValue('entity') == '' || recOpps.getValue('entity') == null ){
				
	        	retMe.status = 'FAILED';
				retMe.response = {
					message: '<b>Integration Error.<b/><br/>INVALID_DATA: Please check if the NetSuite ID of the HubSpot Company <a href="/contacts/21390342/company/"'+ objCompany.id + '" target="_blank">'+ objCompany.properties.name +'</a> matches the ID in NetSuite.'
				};
				
				return retMe;
			}
			
			if(recOpps.getValue('subsidiary') != objDeal.properties.nssubsidiary ||
					recOpps.getValue('currency') != jsonmapns.jsonGetValue({
			            mapping: objOppsMapping,
			            data: objDeal,
			            key: 'currency'
			        })){
				
	        	retMe.status = 'FAILED';
				retMe.response = {
					message: '<b>Integration Error.<b/><br/>INVALID_DATA: Please check if Subsidiary and Currency of the Deal is included in the NetSuite Customer <a href="https://3688201.app.netsuite.com/app/common/entity/custjob.nl?id='+ recOpps.getValue('entity') + '" target="_blank">'+ recOpps.getText('entity') +'</a>'
				};
				
				return retMe;
			}
			
			var arrSalesRep = query.runSuiteQL('SELECT id FROM employee WHERE custentity_hubspot_id = '+ objDeal.properties.hubspot_owner_id).asMappedResults();
			
			if (arrSalesRep.length > 0) {


				if (recOpps.getLineCount({
					sublistId: 'salesteam'
				}) > 0) {
					recOpps.removeLine({
						sublistId: 'salesteam',
						line: 0
					})
				}

				recOpps.selectNewLine({
					sublistId : 'salesteam'
				});

				recOpps.setCurrentSublistValue({
					sublistId : 'salesteam',
					fieldId : 'employee',
					value : arrSalesRep[0].id
				});

				recOpps.setCurrentSublistValue({
					sublistId : 'salesteam',
					fieldId : 'salesrole',
					value : '-2'
				});
				recOpps.setCurrentSublistValue({
					sublistId : 'salesteam',
					fieldId : 'isprimary',
					value : true
				});

				recOpps.setCurrentSublistValue({
					sublistId : 'salesteam',
					fieldId : 'contribution',
					value : '100.00'
				});

				recOpps.commitLine({
					sublistId : 'salesteam'
				});
			}
			
			recOpps.setValue({
				fieldId : 'custbody_nshs_logs',
				value : 'NetSuite Opportunity Created '
						+ (new Date()).toString()
			});
			var idOpps = recOpps.save();
			
			retMe.status = 'SUCCESS';
			retMe.response = {
				id : idOpps
			};
			
			var arrOpps = query.runSuiteQL('SELECT tranid FROM transaction WHERE id = '+ idOpps).asMappedResults();
			
			var objPayload = {
				inputs : [ {
					id : option.id,
					properties : {
						nsid : idOpps,
						nstranid : arrOpps[0].tranid,
						nsurl : 'https://3688201.app.netsuite.com/app/accounting/transactions/opprtnty.nl?id='+ idOpps,
						dealstage: 9440409 //
					}
				} ]
			};
			
			var resp = https.post({
						url : "https://api.hubapi.com/crm/v3/objects/deals/batch/update?hapikey={custsecret_hubspot_apikey}",
						body : JSON.stringify(objPayload),
						headers : {
							'Content-Type' : 'application/json',
							'Accept' : '*/*'
						},
						credentials : [ 'custsecret_hubspot_apikey' ]
					});
		} 
        catch (err) {
        	
        	retMe.status = 'FAILED';
			retMe.response = {
				message: err
			};
			
			return retMe;
		}
		return retMe;
	};
	
	update = function(option){
		
		var retMe = {
			request: option
		};
		
		var idOpps = this.search(option);
		
		if(idOpps){
			
	        var recMapping = record.load({
	            type: 'customrecord_integration_mapping',
	            id: 123
	        });
	        
	        var objOppsMapping = JSON.parse(recMapping.getValue({
	                    fieldId: 'custrecord_intmap_mapping'
	        }));
			
			var objData;
			var nsptDeal = deal.get({ 
				id: option.associatedObjectId
			});
			
			log.audit({title: 'opportunity.update', details: 'idOpps: ' + idOpps});
			
			var recOpps = record.load({
				type: record.Type.OPPORTUNITY, 
				id: idOpps, 
				isDynamic : true 
			}); 
			
			if(nsptDeal.status == 'SUCCESS'){
				
				objData = nsptDeal.response.data;
				
		        for (var key in objOppsMapping) {

		        	recOpps = jsonmapns.jsonMap({
		                mapping: objOppsMapping,
		                record: recOpps,
		                data: objData,
		                key: key
		            });
		        }
		        
		        recOpps.setValue({
					fieldId: 'custbody_nshs_logs',
					value: 'NetSuite Opportunity Updated '+ (new Date()).toString()
				});
		        
		        var idOpps = recOpps.save();

				retMe.status = 'SUCCESS';
				retMe.response = {
					id : idOpps
				};
			}
			else if (nsptDeal.status == 'FAILED' ){
				return nsptDeal;
			}
		}
		else{
			this.create(option);
		}
		
		return retMe;
	};
	
	get = function(option){
		
	};
	
	search = function(option){
		
		var arrResult = query.runSuiteQL({
			query: 'SELECT id FROM transaction WHERE custbody_hubspot_id = ' + option.associatedObjectId
		}).asMappedResults();
		
		if(arrResult.length > 0){
			return arrResult[0].id;	
		}
		else{
			return null;
		}
	};
	
    return {
    	create: create,
    	update: update,
    	get: get,
    	search: search
    };
    
});
