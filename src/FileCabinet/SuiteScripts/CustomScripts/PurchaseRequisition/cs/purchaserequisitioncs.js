/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/ui/dialog', '../api/purchaserequisition'],

    function (dialog, purchaserequesition) {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {
            var currRecord = scriptContext.currentRecord;
            if (scriptContext.mode === 'copy') {
                purchaserequesition.copyRequisition(currRecord);
            }

            var stHtml = '<script>';
            stHtml += 'jQuery( document ).ready(function() {console.log( "ready!" );';
            stHtml += 'jQuery("#custpageworkflow601").click(function(){alert("The paragraph was clicked.");});});';
            stHtml += '</script>';



            // var options = {
            //     title: 'Reason for Canceling PR',
            //     message: dialogBody()
            // };
            //
            // function success(result) { console.log('Success with value: ' + result) }
            // function failure(reason) { console.log('Failure: ' + reason) }
            //
            // dialog.create(options).then(success).catch(failure);
        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {
            var currRecord = scriptContext.currentRecord;

            if (scriptContext.fieldId == 'item') {
                var sublistName = currRecord.getSublist({sublistId: "item"});
                var colEstimatedAmount = sublistName.getColumn({fieldId: "estimatedamount"});
                colEstimatedAmount.isDisabled = true;
            }
        }

        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         *
         * @since 2015.2
         */
        function postSourcing(scriptContext) {

        }

        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(scriptContext) {

        }

        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function lineInit(scriptContext) {
            var currRecord = scriptContext.currentRecord;

            purchaserequesition.disabledSublistField(currRecord);
        }

        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(scriptContext) {

        }

        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(scriptContext) {
            var currRecord = scriptContext.currentRecord;

            var inEstimatedRate = currRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'estimatedrate'
            });

            if (inEstimatedRate == 0) {
                alert("Please input a value in Estimated Rate.")
                return false;
            } else {
                return true;
            }
        }

        /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(scriptContext) {

        }

        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(scriptContext) {

        }

        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {
            var options = {
                title: 'Reason for Canceling PR',
                message: dialogBody()
            };

            function success(result) { console.log('Success with value: ' + result) }
            function failure(reason) { console.log('Failure: ' + reason) }

            dialog.create(options).then(success).catch(failure);
        }

        function dialogBody() {
            var stHtml = '<table><tr><td><div>';
            stHtml += '<p>Reason: <textarea rows="4" cols="45">\n </textarea></p>'
            stHtml += '</div></td></tr></table>';
            stHtml += '<table><tr><td>';
            stHtml += '<div class="uir-message-buttons"><button value="shadow-1" onclick="submitOK(true)">Ok</button></div></td>';
            stHtml += '<td><div class="uir-message-buttons"><button value="shadow-2" onclick="submitCancel(false)">Cancel</button></div></td></tr></table>';
            stHtml += '<script>';
            stHtml += '</script>';

            return stHtml;
        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            lineInit: lineInit,
            // validateField: validateField,
            validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            // saveRecord: saveRecord
        };

    });
