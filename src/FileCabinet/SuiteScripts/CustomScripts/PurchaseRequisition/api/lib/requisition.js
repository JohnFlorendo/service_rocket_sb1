define([],
    function () {

        resetValue = function (currRecord) {
            var arrFieldId = [
                'custbody_ss_grand_total',
                'custbody_ss_total_committed',
                'custbody_ss_total_available',
                'custbody_ss_total_buffer',
                'custbody_ss_gst_amount',
                'custbody_sr_proc_spend_updated',
                'custbody_proc_data_completed_proceedpo',
                'memo',
                'custbody_sr_expiry_date',
                'custbody_payment_method_purchasing',
                'custbody_sr_notes_finance'
            ]

            currRecord.setValue({
                fieldId: 'custbody_apm_approvalstatus',
                value: 1
            });

            for (var stField in arrFieldId) {
                var stFieldId = arrFieldId[stField];

                var stFields = currRecord.getField({
                    fieldId: stFieldId
                });
                console.log('stFields: ' + stFields.type);

                if (stFields.type == 'currency') {
                    currRecord.setValue({
                        fieldId: stFieldId,
                        value: 0
                    });
                } else if (stFields.type == 'checkbox') {
                    currRecord.setValue({
                        fieldId: stFieldId,
                        value: false
                    });
                } else if (stFields.type == 'text') {
                    currRecord.setValue({
                        fieldId: stFieldId,
                        value: ''
                    });
                } else if (stFields.type == 'date') {
                    currRecord.setValue({
                        fieldId: stFieldId,
                        value: ''
                    });
                } else if (stFields.type == 'select') {
                    currRecord.setValue({
                        fieldId: stFieldId,
                        value: ''
                    });
                } else if (stFields.type == 'textarea') {
                    currRecord.setValue({
                        fieldId: stFieldId,
                        value: ''
                    });
                }
            }
        };

        estimatedAmount = function (currRecord) {
            var sublistName = currRecord.getSublist({sublistId: "item"});
            var colEstimatedAmount = sublistName.getColumn({fieldId: "estimatedamount"});
            colEstimatedAmount.isDisabled = true;
        }

        gstAmountField = function (newRec) {
            var inTotalGST = 0;
            var inLine = newRec.getLineCount({
                sublistId: 'item'
            });
            log.debug('inLine', inLine);

            for (var indx = 0; indx < inLine; indx++) {
                var inGSTAmount = newRec.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_gst_amount',
                    line: indx
                });
                inTotalGST += inGSTAmount;
            }
            log.debug('inTotalGST', inTotalGST);

            newRec.setValue({
                fieldId: 'custbody_ss_gst_amount',
                value: inTotalGST
            });
        }

        estimatedRateMandatory = function (currRecord) {
            var inEstimatedRate = currRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'estimatedrate'
            });

            if (inEstimatedRate == 0) {
                alert("Please enter a value for Estimated Rate.")
                return false;
            } else {
                return true;
            }
        }

        return {
            resetValue: resetValue,
            estimatedAmount: estimatedAmount,
            gstAmountField: gstAmountField,
            estimatedRateMandatory: estimatedRateMandatory
        };

    });