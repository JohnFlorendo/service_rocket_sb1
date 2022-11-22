/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/record', '../api/netspot'],

    function (runtime, record, netspot) {

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(scriptContext) {}

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext) {}

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(scriptContext) {

        var newRec = scriptContext.newRecord;
        var idMe = runtime.getCurrentUser().id;

        if (scriptContext.type == 'delete') {
            return;
        }

        if (newRec.type == record.Type.CUSTOMER && scriptContext.type == 'create' && runtime.executionContext === runtime.ContextType.USER_INTERFACE) {

            var recCustomer = record.load({
                type: newRec.type,
                id: newRec.id,
                isDynamic: true
            });

            var nsptCompany = netspot.createCompany({
                record: recCustomer
            });

            var recCustomer = record.load({
                type: newRec.type,
                id: newRec.id,
                isDynamic: true
            });

            if (nsptCompany.status == 'SUCCESS') {

                recCustomer.setValue({
                    fieldId: 'custentity_hubspot_id',
                    value: nsptCompany.response.id
                });

                recCustomer.setValue({
                    fieldId: 'custentity_nshs_logs',
                    value: nsptCompany.response.message
                });

                var id = recCustomer.save();
            } 
            else if (result.status == 'FAILED') {

                recCustomer.setValue({
                    fieldId: 'custentity_nshs_logs',
                    value: result.status + ': ' + result.response.message
                });
            }

            try{
            	var id = recCustomer.save();
            }
            catch(err){
            	log.audit({
    	    		title: 'netspot.ue', 
    	    		details: 'ERROR: ' + err
    	    	});	
            }
        } 
        else if (newRec.type == record.Type.CUSTOMER && scriptContext.type == 'edit') {

            var recCustomer = record.load({
                type: newRec.type,
                id: newRec.id,
                isDynamic: true
            });

            var nsptCompany = netspot.updateCompany({
                record: recCustomer
            });

            var recCustomer = record.load({
                type: newRec.type,
                id: newRec.id,
                isDynamic: true
            });

            if (nsptCompany.status == 'SUCCESS') {

                recCustomer.setValue({
                    fieldId: 'custentity_nshs_logs',
                    value: nsptCompany.response.message
                });
            } 
            else if (nsptCompany.status == 'FAILED') {

                recCustomer.setValue({
                    fieldId: 'custentity_nshs_logs',
                    value: nsptCompany.response.message
                });
            }

            try{
            	var id = recCustomer.save();
            }
            catch(err){
            	log.audit({
    	    		title: 'netspot.ue', 
    	    		details: 'ERROR: ' + err
    	    	});	
            }
        } 
        
        else if (newRec.type == record.Type.CONTACT && scriptContext.type == 'create') {

            var recContact = record.load({
                type: newRec.type,
                id: newRec.id,
                isDynamic: true
            });

            var nsptContact = netspot.createContact({
                record: recContact,
                usemap: true
            });

            var recContact = record.load({
                type: newRec.type,
                id: newRec.id,
                isDynamic: true
            });

            if (nsptContact.status == 'SUCCESS') {

            	recContact.setValue({
                    fieldId: 'custentity_hubspot_id',
                    value: nsptContact.response.id
                });

            	recContact.setValue({
                    fieldId: 'custentity_nshs_logs',
                    value: nsptContact.response.message
                });
            } 
            else if (nsptContact.status == 'FAILED') {

            	recContact.setValue({
                    fieldId: 'custentity_nshs_logs',
                    value: nsptContact.status + ': ' + nsptContact.response.message
                });
            }

            try{
            	var id = recContact.save();
            }
            catch(err){
            	log.audit({
    	    		title: 'netspot.ue', 
    	    		details: 'ERROR: ' + err
    	    	});	
            }
        }
        else if (newRec.type == record.Type.CONTACT && scriptContext.type == 'edit') {

            var recContact = record.load({
                type: newRec.type,
                id: newRec.id,
                isDynamic: true
            });
            
            
            var nsptContact;

            if(recContact.getValue('custentity_hubspot_id')){
            	
            	nsptContact = netspot.updateContact({
                    record: recContact,
                    usemap: true
                });
            }
            else{
            	
            	nsptContact = netspot.createContact({
                    record: recContact,
                    usemap: true
                });	
            }
            
            var recContact = record.load({
                type: newRec.type,
                id: newRec.id,
                isDynamic: true
            });

            if (nsptContact.status == 'SUCCESS') {
            	
            	recContact.setValue({
                    fieldId: 'custentity_nshs_logs',
                    value: nsptContact.response.message
                });
            } 
            else if (nsptContact.status == 'FAILED') {

            	recContact.setValue({
                    fieldId: 'custentity_nshs_logs',
                    value: nsptContact.status + ': ' + nsptContact.response.message
                });
            }

            try{
            	var id = recContact.save();
            }
            catch(err){
            	log.audit({
    	    		title: 'netspot.ue', 
    	    		details: 'ERROR: ' + err
    	    	});	
            }
        }
        
        else if (newRec.type == record.Type.OPPORTUNITY && scriptContext.type == 'create' && runtime.executionContext === runtime.ContextType.USER_INTERFACE) {

            var recOpportunity = record.load({
                type: newRec.type,
                id: newRec.id,
                isDynamic: true
            });

            var nsptDeal = netspot.createDeal({
                record: recOpportunity
            });

        	log.audit({
	    		title: 'netspot.ue', 
	    		details: 'nsptDeal: ' + nsptDeal.status
	    	});	
            
            
            if (nsptDeal.status == 'SUCCESS') {

                var nsptAssociate = netspot.associateDeal({
                    id: nsptDeal.response.id,
                    to: recOpportunity.getValue('custbody_hubspot_customer_id'),
                    type: 'companies'
                });
                
            	log.audit({
    	    		title: 'netspot.ue', 
    	    		details: 'nsptAssociate: ' + nsptAssociate.status
    	    	});	

                var recOpportunity = record.load({
                    type: newRec.type,
                    id: newRec.id,
                    isDynamic: true
                });

                recOpportunity.setValue({
                    fieldId: 'custbody_nshs_logs',
                    value: nsptDeal.response.message
                });
                
                recOpportunity.setValue({
                    fieldId: 'custbody_hubspot_id',
                    value: nsptDeal.response.id
                });

                recOpportunity.setValue({
                    fieldId: 'custbody_hubspot_hs_lastmodifieddate',
                    value: nsptDeal.response.lastupdate
                });
                
                if(nsptAssociate.status == 'SUCCESS'){
                	
                    recOpportunity.setValue({
                        fieldId: 'custbody_nshs_logs',
                        value: nsptAssociate.response.message
                    });
                    
                    recOpportunity.setValue({
                        fieldId: 'custbody_hubspot_hs_lastmodifieddate',
                        value: nsptAssociate.response.lastupdate
                    });
                }
                else if (nsptAssociate.status == 'FAILED') {

                    recOpportunity.setValue({
                        fieldId: 'custentity_nshs_logs',
                        value: nsptAssociate.response.message
                    });
                }
            }
            else if (nsptDeal.status == 'FAILED') {

                recOpportunity.setValue({
                    fieldId: 'custentity_nshs_logs',
                    value: nsptDeal.response.message
                });
            }

            try{
            	var id = recOpportunity.save();
            }
            catch(err){
            	
            	log.audit({
    	    		title: 'netspot.ue', 
    	    		details: 'ERROR: ' + err
    	    	});	
            }
        } 
        else if (newRec.type == record.Type.OPPORTUNITY && scriptContext.type == 'edit') {

            var recOpportunity = record.load({
                type: newRec.type,
                id: newRec.id,
                isDynamic: true
            });

            var nsptDeal = netspot.updateDeal({
                record: recOpportunity
            });

            var recOpportunity = record.load({
                type: newRec.type,
                id: newRec.id,
                isDynamic: true
            });

            if (nsptDeal.status == 'SUCCESS') {

                recOpportunity.setValue({
                    fieldId: 'custbody_nshs_logs',
                    value: nsptDeal.response.message
                });

                recOpportunity.setValue({
                    fieldId: 'custbody_hubspot_hs_lastmodifieddate',
                    value: nsptDeal.response.lastupdate
                });
            } 
            else if (nsptDeal.status == 'FAILED') {

                recOpportunity.setValue({
                    fieldId: 'custentity_nshs_logs',
                    value: nsptDeal.response.message
                });
            }
            
            try{
            	var id = recOpportunity.save();
            }
            catch(err){
            	log.audit({
    	    		title: 'netspot.ue', 
    	    		details: 'ERROR: ' + err
    	    	});	
            }
        }
        else if (newRec.type != record.Type.OPPORTUNITY && newRec.type != record.Type.CUSTOMER) {

            if (scriptContext.type != 'delete') {
                var rec = record.load({
                    type: newRec.type,
                    id: newRec.id,
                    isDynamic: true
                });
                rec = netspot.sendHubRequest(rec);
                var id = rec.save();
            }
        } 
        
        var scriptObj = runtime.getCurrentScript();
        
    	log.audit({
    		title: 'netspot.ue', 
    		details: 'FREEUSAGEUNITS: ' + scriptObj.getRemainingUsage()
    	});	
        
    }

    return {
        afterSubmit: afterSubmit
    };

});
