define([],
    function () {

        setSpendScheduleFields = function (currRecord) {
            var arrFieldId = [
                'custbody_ss_grand_total',
                'custbody_ss_total_committed',
                'custbody_ss_total_available',
                'custbody_ss_total_buffer',
                'custbody_ss_gst_amount',
                'custbody_sr_proc_spend_updated',
                'custbody_proc_data_completed_proceedpo',
                'memo'
            ]

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
                }
            }
        };

        estimatedAmount = function (currRecord) {
            var inLine = currRecord.getLineCount({
                sublistId: 'item'
            });
            for (var indx = 0; indx < inLine; indx++) {

                var fldEstimatedAmount = currRecord.getSublistField({
                    sublistId: 'item',
                    fieldId: 'estimatedamount',
                    line: indx
                });
                fldEstimatedAmount.isDisabled = true;

                var fldEstimatedRate = currRecord.getSublistField({
                    sublistId: 'item',
                    fieldId: 'estimatedrate',
                    line: indx
                });
                fldEstimatedRate.isMandatory = true;
            }
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

        return {
            setSpendScheduleFields: setSpendScheduleFields,
            estimatedAmount: estimatedAmount,
            gstAmountField: gstAmountField
        };

    });