/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/format', 'N/record', 'N/search', 'N/task', 'N/ui/message', 'N/ui/serverWidget', 'N/url', '../api/spendschedule'],

    (format, record, search, task, message, serverWidget, url, libFieldMapping) => {
        var Purchase_Order = 'purchaseorder';
        var Spend_Schedule = 'customrecord_sr_spend_schedule';

        const beforeLoad = (scriptContext) => {
            var newRecord = scriptContext.newRecord;

            if (newRecord.type == Spend_Schedule) {
                var inTransId = newRecord.getValue('custrecord_sr_sp_sch_po_pr_trans');
                if (!inTransId) {
                    inTransId = newRecord.getValue('custrecord_sr_sp_sch_po_trans');
                }

                if (inTransId) {
                    var arrResult = libFieldMapping.searchLineDescriptionRequisition(inTransId);
                    var objField = scriptContext.form.addField({
                        id: libFieldMapping.fieldIds.Custpage_Line_Description,
                        type: serverWidget.FieldType.SELECT,
                        label: 'Line Description',
                        // container: 'main'
                    });
                    objField.isMandatory = true;
                    scriptContext.form.insertField({
                        field: objField,
                        nextfield: 'custrecord_sr_sp_sch_amount'
                    });

                    objField.addSelectOption({
                        value: '',
                        text: ''
                    });

                    for (var indx = 0; indx < arrResult.length; indx++) {
                        var objPerTransactionRecord = arrResult[indx];
                        for (var stField in objPerTransactionRecord) {
                            var valueField = objPerTransactionRecord[stField];
                            if (valueField) {
                                objField.addSelectOption({
                                    value: valueField.trim().replace(/\r?\n|\r/g, " "),
                                    text: valueField
                                });
                            }
                        }
                    }

                    var stLineDescription = newRecord.getValue({
                        fieldId: libFieldMapping.fieldIds.Custrecord_Line_Description
                    });
                    log.debug('load stLineDescription', stLineDescription);
                    newRecord.setValue({
                        fieldId: libFieldMapping.fieldIds.Custpage_Line_Description,
                        value: stLineDescription
                    });
                }
            }
        }

        const beforeSubmit = (scriptContext) => {
            var newRecord = scriptContext.newRecord;

            if (newRecord.type == Spend_Schedule) {
                var stLineDescription = newRecord.getValue({
                    fieldId: libFieldMapping.fieldIds.Custpage_Line_Description
                });
                log.debug('submit stLineDescription', stLineDescription);
                newRecord.setValue({
                    fieldId: libFieldMapping.fieldIds.Custrecord_Line_Description,
                    value: stLineDescription
                });
            }
        }

        const afterSubmit = (scriptContext) => {
            var newRecord = scriptContext.newRecord;

            if (newRecord.id != null) {
                if (newRecord.type == Purchase_Order) {
                    var intRequisitionId = libFieldMapping.getRequisitionId(newRecord.id);
                    if (intRequisitionId) {
                        var intPurchaseOrderId = newRecord.id;
                        var arrSpendSchedules = libFieldMapping.getSpendSchedules(intRequisitionId, intPurchaseOrderId);
                        if (arrSpendSchedules.length != 0) {
                            try {
                                var mrTask = task.create({taskType: task.TaskType.MAP_REDUCE});
                                mrTask.scriptId = 'customscript_spendschedule_mr';
                                mrTask.params = {'custscript_param_arrdata': JSON.stringify(arrSpendSchedules)};
                                var mrTaskId = mrTask.submit();
                                log.debug('mrTaskId', mrTaskId);
                            } catch (e) {
                                throw {message: " A purchase order is created but the spend schedule is not create because all deployments are being processed. Please contact your administrator to increase the deployment."}.message
                            }
                        }
                    }
                } else {
                    var intPurchaseOrderId = newRecord.getValue('custrecord_sr_sp_sch_po_trans');
                    if (!intPurchaseOrderId) {
                        var intRequisitionId = newRecord.getValue('custrecord_sr_sp_sch_po_pr_trans');
                        if (intRequisitionId) {
                            intPurchaseOrderId = libFieldMapping.getPurchaseOrderId(intRequisitionId);
                            if (intPurchaseOrderId) {
                                record.submitFields({
                                    type: "customrecord_sr_spend_schedule",
                                    id: newRecord.id,
                                    values: {custrecord_sr_sp_sch_po_trans: intPurchaseOrderId}
                                });
                            }
                        }
                    }

                    /** Update Requisition Totals **/
                    libFieldMapping.updateRequisition(newRecord);
                }
            }
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
