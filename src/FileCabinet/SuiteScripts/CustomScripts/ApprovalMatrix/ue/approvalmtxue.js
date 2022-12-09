/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/file', 'N/ui/serverWidget', 'N/runtime', 'N/error', 'N/query', 'N/currency', 'N/redirect', 'N/ui/message', '../../Library/handlebars', '../api/approvalmatrix', '../api/lib/matrix'],

    function (record, file, serverWidget, runtime, error, query, currency, redirect, message, handlebars, approvalmatrix, matrix) {

        const requisitionRole = [1181, 1349]; //Requisition role
        const accountantRole = [1017, 1336]; //Rocketeer Accountant role
        const rocketeerRole = [1022, 1185]; //Rocketeer role

        const oldForm = 144;
        const shefeeque = 9140;
        const wendy = 981377;

        function beforeLoad(scriptContext) {
            var newRec = scriptContext.newRecord
            var userId = runtime.getCurrentUser().id;
            var userRole = runtime.getCurrentUser().role;

            var isPRAdmin = requisitionRole.indexOf(userRole) != -1;
            var isRocketeerAccountant = accountantRole.indexOf(userRole) != -1;
            var isRocketeer = rocketeerRole.indexOf(userRole) != -1;

            var form = scriptContext.form;

            if (scriptContext.type == scriptContext.UserEventType.VIEW) {

                var sStatus = approvalmatrix.current({
                    record: newRec.type,
                    recordid: newRec.id
                });

                log.audit({
                    title: 'approvalmatrix',
                    details: 'sStatus: ' + sStatus
                });

                switch (sStatus) {
                    case 'submit':
                        var arrButtons = [
                            {
                                id: 'custpage_btn_submit',
                                label: 'Submit For Approval',
                                functionName: 'submitforapproval'
                            }
                        ]

                        var displayStatus = 'Not Submitted'

                        var stTitleLabel = '<script>'
                        stTitleLabel += 'var stStatusLabel = document.getElementsByClassName(\'uir-record-status\');' +
                            'var stLabel = \'' + displayStatus + '\';' +
                            'stStatusLabel[0].innerHTML  = stLabel.toString();';
                        stTitleLabel += '</script>'

                        form.addField({
                            id: 'custpage_statuslabel2',
                            label: 'not shown - hidden`',
                            type: serverWidget.FieldType.INLINEHTML
                        }).defaultValue = stTitleLabel;

                        approvalmatrix.buttons({
                            form: form,
                            newRec: newRec,
                            arrButtons: arrButtons
                        });
                        break;

                    case 'cancelled':
                        if (newRec.type == 'purchaserequisition') {

                            form.removeButton('edit');

                            var stTitleLabel = '<script>'

                            stTitleLabel += 'var stStatusLabel = document.getElementsByClassName(\'uir-record-status\');' +
                                'var stLabel = \'' + sStatus + '\';' +
                                'stStatusLabel[0].innerHTML  = stLabel.toString();';
                            stTitleLabel += '</script>'

                            form.addField({
                                id: 'custpage_statuslabel',
                                label: 'not shown - hidden',
                                type: serverWidget.FieldType.INLINEHTML
                            }).defaultValue = stTitleLabel;
                        }
                        break;

                    case 'procurementreview':

                        var objData = {};
                        objData.expirydate = newRec.getValue('custbody_sr_expiry_date');

                        objData.paymentmethod = newRec.getValue('custbody_payment_method_purchasing');


                        if (newRec.type == 'purchaserequisition') {

                            var arrButtons = [
                                {
                                    id: 'custpage_btn_spendschedupdated',
                                    label: 'Spend Schedule Updated',
                                    functionName: 'spendScheduleUpdated'
                                }, {
                                    id: 'custpage_btn_datachecked',
                                    label: 'Data Checked',
                                    functionName: 'dataChecked(' + JSON.stringify(objData) + ')'
                                }

                            ]

                            var displayStatus = 'PENDING ORDER(Procurement Review Needed)'

                            var stTitleLabel = '<script>'
                            stTitleLabel += 'var stStatusLabel = document.getElementsByClassName(\'uir-record-status\');' +
                                'var stLabel = \'' + displayStatus + '\';' +
                                'stStatusLabel[0].innerHTML  = stLabel.toString();';
                            stTitleLabel += '</script>'

                            form.addField({
                                id: 'custpage_statuslabel2',
                                label: 'not shown - hidden`',
                                type: serverWidget.FieldType.INLINEHTML
                            }).defaultValue = stTitleLabel;


                            if (isPRAdmin) {
                                if (!objData.paymentmethod || !objData.expirydate) {
                                    form.addPageInitMessage({
                                        type: message.Type.WARNING,
                                        title: 'WARNING: (For Procurement Team only. The PR Requestor and Approver can ignore this message)',
                                        message: 'Expiry Date or Payment Method fields are empty. This PR has been approved and will proceed to the next phase (PO and Payment)'
                                    })
                                }

                                approvalmatrix.buttons({
                                    form: form,
                                    newRec: newRec,
                                    arrButtons: arrButtons
                                });
                            }

                            form.removeButton('createpo');

                            if (!isPRAdmin) {
                                form.removeButton('edit');
                            }

                        }
                        break;

                    case 'spendscheduleupdated':
                        if (newRec.type == 'purchaserequisition') {

                            var objData = {};
                            objData.expirydate = newRec.getValue('custbody_sr_expiry_date');

                            objData.paymentmethod = newRec.getValue('custbody_payment_method_purchasing');

                            var arrButtons = [
                                {
                                    id: 'custpage_btn_datachecked',
                                    label: 'Data Checked',
                                    functionName: 'dataChecked(' + JSON.stringify(objData) + ')'
                                }
                            ]
                            var displayStatus = 'PENDING ORDER(Spend Schedule Updated)'

                            var stTitleLabel = '<script>'
                            stTitleLabel += 'var stStatusLabel = document.getElementsByClassName(\'uir-record-status\');' +
                                'var stLabel = \'' + displayStatus + '\';' +
                                'stStatusLabel[0].innerHTML  = stLabel.toString();';
                            stTitleLabel += '</script>'

                            form.addField({
                                id: 'custpage_statuslabel2',
                                label: 'not shown - hidden`',
                                type: serverWidget.FieldType.INLINEHTML
                            }).defaultValue = stTitleLabel;


                            if (isPRAdmin) {
                                if (!objData.paymentmethod || !objData.expirydate) {
                                    form.addPageInitMessage({
                                        type: message.Type.WARNING,
                                        title: 'WARNING: (For Procurement Team only. The PR Requestor and Approver can ignore this message)',
                                        message: 'Expiry Date or Payment Method fields are empty. This PR has been approved and will proceed to the next phase (PO and Payment)'
                                    })
                                }

                                approvalmatrix.buttons({
                                    form: form,
                                    newRec: newRec,
                                    arrButtons: arrButtons
                                });
                            }

                            form.removeButton('createpo');

                            if (!isPRAdmin) {
                                form.removeButton('edit');
                            }


                        }
                        break;

                    case 'datachecked':
                        if (newRec.type == 'purchaserequisition') {

                            var arrButtons = [
                                {
                                    id: 'custpage_btn_spendschedupdated',
                                    label: 'Spend Schedule Updated',
                                    functionName: 'spendScheduleUpdated'
                                }
                            ]

                            var displayStatus = 'PENDING ORDER(Data Checked)'

                            var stTitleLabel = '<script>'
                            stTitleLabel += 'var stStatusLabel = document.getElementsByClassName(\'uir-record-status\');' +
                                'var stLabel = \'' + displayStatus + '\';' +
                                'stStatusLabel[0].innerHTML  = stLabel.toString();';
                            stTitleLabel += '</script>'

                            form.addField({
                                id: 'custpage_statuslabel2',
                                label: 'not shown - hidden',
                                type: serverWidget.FieldType.INLINEHTML
                            }).defaultValue = stTitleLabel;


                            if (isPRAdmin) {
                                var objData = {};

                                objData.expirydate = newRec.getValue('custbody_sr_expiry_date');
                                objData.paymentmethod = newRec.getValue('custbody_payment_method_purchasing');

                                if (!objData.paymentmethod || !objData.expirydate) {
                                    form.addPageInitMessage({
                                        type: message.Type.WARNING,
                                        title: 'WARNING: (For Procurement Team only. The PR Requestor and Approver can ignore this message)',
                                        message: 'Expiry Date or Payment Method fields are empty. This PR has been approved and will proceed to the next phase (PO and Payment)'
                                    })
                                }

                                approvalmatrix.buttons({
                                    form: form,
                                    newRec: newRec,
                                    arrButtons: arrButtons
                                });
                            }

                            form.removeButton('createpo');

                            if (!isPRAdmin) {
                                form.removeButton('edit');
                            }
                        }
                        break;

                    case 'pending':

                        if (newRec.type == 'purchaserequisition') {

                            if (isRocketeer && newRec.getValue('entity') == userId) {
                                var arrButtons = [{
                                    id: 'custpage_btn_cancel',
                                    label: 'Cancel',
                                    functionName: 'cancel'
                                }];

                                approvalmatrix.buttons({
                                    form: form,
                                    newRec: newRec,
                                    arrButtons: arrButtons
                                });
                            }

                            if (isPRAdmin) {
                                var arrButtons = approvalmatrix.buttonApproval(newRec);

                                approvalmatrix.buttons({
                                    form: form,
                                    newRec: newRec,
                                    arrButtons: arrButtons
                                });
                            }
                            log.audit('pending', newRec.getValue('nextapprover'));
                        }
                        break;

                    case 'approval':

                        if (newRec.type == 'purchaserequisition') {
                            var arrButtons = approvalmatrix.buttonApproval(newRec);

                            approvalmatrix.buttons({
                                form: form,
                                newRec: newRec,
                                arrButtons: arrButtons
                            });
                        }
                        break;

                    case 'approved':

                        if (newRec.type == 'purchaserequisition') {
                            if (newRec.getValue('status') == "Pending Order") {
                                var displayStatus = 'PENDING ORDER(Procurement Review Done)'

                                var stTitleLabel = '<script>'
                                stTitleLabel += 'var stStatusLabel = document.getElementsByClassName(\'uir-record-status\');' +
                                    'var stLabel = \'' + displayStatus + '\';' +
                                    'stStatusLabel[0].innerHTML  = stLabel.toString();';
                                stTitleLabel += '</script>'

                                form.addField({
                                    id: 'custpage_statuslabel2',
                                    label: 'not shown - hidden',
                                    type: serverWidget.FieldType.INLINEHTML
                                }).defaultValue = stTitleLabel;
                            }
                        }

                        if (!isPRAdmin && !isRocketeerAccountant) {
                            form.removeButton('edit');
                            form.removeButton('custpageworkflow608');
                            form.removeButton('createpo');
                        }
                        break;

                    case 'po_pending':

                        if (newRec.type == 'purchaserequisition') {

                            var displayStatus = 'PO: Pending Supervisor Approval'

                            var stTitleLabel = '<script>'
                            stTitleLabel += 'var stStatusLabel = document.getElementsByClassName(\'uir-record-status\');' +
                                'var stLabel = \'' + displayStatus + '\';' +
                                'stStatusLabel[0].innerHTML  = stLabel.toString();';
                            stTitleLabel += '</script>'

                            form.addField({
                                id: 'custpage_statuslabel2',
                                label: 'not shown - hidden',
                                type: serverWidget.FieldType.INLINEHTML
                            }).defaultValue = stTitleLabel;

                        }

                        if (!isPRAdmin) {
                            form.removeButton('edit');
                            form.removeButton('custpageworkflow608');
                            form.removeButton('createpo');
                        }
                        break;

                    case undefined:
                        if (!isPRAdmin) {
                            form.removeButton('edit');
                        }

                        var displayStatus = newRec.getText('custbody_apm_approvalstatus');
                        if (displayStatus) {
                            var stTitleLabel = '<script>'
                            stTitleLabel += 'var stStatusLabel = document.getElementsByClassName(\'uir-record-status\');' +
                                'var stLabel = \'' + displayStatus + '\';' +
                                'stStatusLabel[0].innerHTML  = stLabel.toString();';
                            stTitleLabel += '</script>'

                            form.addField({
                                id: 'custpage_statuslabel2',
                                label: 'not shown - hidden`',
                                type: serverWidget.FieldType.INLINEHTML
                            }).defaultValue = stTitleLabel;
                        }

                        break;
                }

            } else if (scriptContext.type == scriptContext.UserEventType.EDIT) {

                var sStatus = approvalmatrix.current({
                    record: newRec.type,
                    recordid: newRec.id
                });

                log.audit('sStatus', sStatus)
                if (isRocketeerAccountant) {
                    approvalmatrix.fieldDisabled(form);
                }

                switch (sStatus) {
                    case 'procurementreview' || 'spendscheduleupdated' || 'datachecked' || 'cancelled':
                        if (!isPRAdmin) {
                            var errMatrix = error.create({
                                name: 'RECORD_LOCKED',
                                message: "Record has been locked/You don't have permission to edit the record",
                                notifyOff: true
                            });
                            throw errMatrix.message;
                        }
                        break;

                    case 'approved':
                        form.removeButton('edit');
                        break;

                    case 'submit' || 'pending' || 'approval':

                        break;

                    case undefined:
                        if (!isPRAdmin) {
                            var errMatrix = error.create({
                                name: 'RECORD_LOCKED',
                                message: "Record has been locked/You don't have permission to edit the record",
                                notifyOff: true
                            });
                            throw errMatrix.message;
                        }

                        break;
                }

                if (newRec.getValue('customform') == oldForm && (userRole == 1181 && (userId == shefeeque || userId == wendy))) {
                    var fldApprovalStatus = form.getField('custbody_apm_approvalstatus');

                    fldApprovalStatus.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.NORMAL
                    });
                }

            }
        }

        function beforeSubmit(scriptContext) {
        }

        function afterSubmit(scriptContext) {
            var newRec = scriptContext.newRecord;
            if (scriptContext.type == scriptContext.UserEventType.CREATE) {
                approvalmatrix.initialize({
                    record: newRec.type,
                    recordid: newRec.id,
                    requisitionRole: requisitionRole,
                    accountantRole: accountantRole,
                    requestor: newRec.getValue('entity'),
                    newRec: newRec
                });
            } else if (scriptContext.type == scriptContext.UserEventType.EDIT
                && runtime.executionContext === runtime.ContextType.USER_INTERFACE) {
                var userRole = runtime.getCurrentUser().role;
                var isPRAdmin = requisitionRole.indexOf(userRole) != -1;

                var sStatus = approvalmatrix.current({
                    record: newRec.type,
                    recordid: newRec.id
                });

                if ((sStatus == 'pending' || sStatus == 'rejected' || sStatus == 'approval') && !isPRAdmin) {

                    approvalmatrix.initialize({
                        record: newRec.type,
                        recordid: newRec.id,
                        requisitionRole: requisitionRole,
                        accountantRole: accountantRole,
                        requestor: newRec.getValue('entity'),
                        newRec: newRec
                    });
                }
            }
        }

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit
        };

    });
