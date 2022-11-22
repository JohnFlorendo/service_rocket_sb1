/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search', 'N/runtime'],

    function (record, search,runtime) {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        function beforeLoad(scriptContext) {

            if (scriptContext.type == scriptContext.UserEventType.EDIT) {
                var newRec = scriptContext.newRecord;
                var idUser = runtime.getCurrentUser().id;
                var sNoteType = newRec.getValue({fieldId: 'notetype'});
                var transactionId = newRec.getValue({fieldId: 'transaction'});
                var authorId = newRec.getValue({fieldId: 'author'});

                var objTransactionType = search.lookupFields({
                    type: 'transaction',
                    id: transactionId,
                    columns: ['recordtype']
                });
                if(authorId!=idUser){
                    throw {message: " This note is locked. You don't have permission to edit/delete this note."}.message;
                }
                if (objTransactionType && objTransactionType.recordtype == search.Type.PURCHASE_REQUISITION && sNoteType == 9/*System Note - APM*/) {
                    throw {message: " This note is locked. You don't have permission to edit/delete this note."}.message;
                }

            }
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        function beforeSubmit(scriptContext) {

            if (scriptContext.type == scriptContext.UserEventType.DELETE) {
                var oldRecord = scriptContext.oldRecord;
                var idUser = runtime.getCurrentUser().id;
                var sNoteType = oldRecord.getValue({fieldId: 'notetype'});
                var transactionId = oldRecord.getValue({fieldId: 'transaction'});
                var authorId = oldRecord.getValue({fieldId: 'author'});

                var objTransactionType = search.lookupFields({
                    type: 'transaction',
                    id: transactionId,
                    columns: ['recordtype']
                });
                if(authorId!=idUser){
                    throw {message: " This note is locked. You don't have permission to edit/delete this note."}.message;
                }
                if (objTransactionType && objTransactionType.recordtype == search.Type.PURCHASE_REQUISITION && sNoteType == 9/*System Note - APM*/) {
                    throw {message: " This note is locked. You don't have permission to edit/delete this note."}.message;
                }

            }


        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        function afterSubmit(scriptContext) {

        }

        return {
            beforeLoad: beforeLoad,
            beforeSubmit: beforeSubmit
        }

    });
