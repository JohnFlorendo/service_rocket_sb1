/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/record', '../api/purchaserequisition'],

    function(runtime, record, purchaserequesition) {

        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type
         * @param {Form} scriptContext.form - Current form
         * @Since 2015.2
         */
        function beforeLoad(scriptContext) {

        }

        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type
         * @Since 2015.2
         */
        function beforeSubmit(scriptContext) {

        }

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
            var newRecord = scriptContext.newRecord;

            // try {
                var isUpdated = false;
                var newRec = record.load({type: newRecord.type, id: newRecord.id, isDynamic : true });;

                if(scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.EDIT) {
                    log.audit({title: newRecord.type, details: newRecord.id });
                    // if(scriptContext.type == scriptContext.UserEventType.CREATE && runtime.executionContext === runtime.ContextType.USER_INTERFACE){
                    if(runtime.executionContext === runtime.ContextType.USER_INTERFACE){

                        var objFolder = purchaserequesition.createFolder(newRec);
                        log.audit({title: 'afterSubmit', details: 'folder:' + JSON.stringify(objFolder)});

                        purchaserequesition.setGSTAmountField(newRec);
                    }
                }

                // if(isUpdated){
                    newRec.save();
                // }


            // } catch(e) { log.debug('ERROR', e); }
        }

        return {
            afterSubmit: afterSubmit
        };

    });
