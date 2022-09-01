/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/file', 'N/ui/serverWidget', 'N/runtime', 'N/error', '../../Library/handlebars', '../api/approvalmatrix'],
    /**
     * @param {record} record
     */
    function (record, file, serverWidget, runtime, error, handlebars, approvalmatrix) {

        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type
         * @param {Form} scriptContext.form - Current form
         * @Since 2015.2
         */
/*
        const pr_adminroles = [4,1181, 1349, 1177, 1330, 1324, 1331, 1322, 1176, 1334, 1320, 1323, 1337, 1321, 1319, 1300, 1311];
*/
        const pr_adminroles = [3,50,8,41, 1179, 1180, 1181, 1017, 1187, 1330, 1178, 1305, 1324, 1331, 1334, 1326,1327,19];


        function createButton(form, newRec, arrButtons) {
            var sTemplate = file.load({
                id: '../btn/btnhtml.html'
            }).getContents();

            var insertHml = form.addField({
                id: 'custpage_pa_jquery1',
                type: serverWidget.FieldType.INLINEHTML,
                label: 'JQ'
            });

            var sHandlebar = handlebars.compile(sTemplate);
            var sHtml = sHandlebar({
                record: newRec.type,
                id: newRec.id
            });

            insertHml.defaultValue = sHtml;

            arrButtons.forEach(function (objButton) {
                form.addButton(objButton);
            })

        }

        function beforeLoad(scriptContext) {
            try {


                var newRec = scriptContext.newRecord
                var idUser = runtime.getCurrentUser().id;

                var isPRAdmin = approvalmatrix.getRequisitionAdminAccess(
                    {
                        custparam: {
                            userid: idUser
                        }
                    }
                )

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
                            createButton(form, newRec, arrButtons)
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

                            if (newRec.type == 'purchaserequisition') {

                                var arrButtons = [
                                    {
                                        id: 'custpage_btn_spendschedupdated',
                                        label: 'Spend Schedule Updated',
                                        functionName: 'spendScheduleUpdated'
                                    }, {
                                        id: 'custpage_btn_datachecked',
                                        label: 'Data Checked',
                                        functionName: 'dataChecked'
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

                                if (isPRAdmin && idUser != newRec.getValue('entity')) {
                                    createButton(form, newRec, arrButtons);
                                }

                                form.removeButton('createpo');

                                if (idUser == newRec.getValue('entity') || !isPRAdmin /*|| pr_adminroles.indexOf(runtime.getCurrentUser().role) == -1*/) {
                                    form.removeButton('edit');
                                }

                            }
                            break;

                        case 'spendscheduleupdated':
                            if (newRec.type == 'purchaserequisition') {

                                var arrButtons = [
                                    {
                                        id: 'custpage_btn_datachecked',
                                        label: 'Data Checked',
                                        functionName: 'dataChecked'
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
                                    createButton(form, newRec, arrButtons);
                                }

                                form.removeButton('createpo');

                                if (idUser == newRec.getValue('entity') || !isPRAdmin/*|| pr_adminroles.indexOf(runtime.getCurrentUser().role) == -1*/) {
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
                                    createButton(form, newRec, arrButtons);
                                }

                                form.removeButton('createpo');

                                if (idUser == newRec.getValue('entity') || !isPRAdmin/*|| pr_adminroles.indexOf(runtime.getCurrentUser().role) == -1*/) {
                                    form.removeButton('edit');
                                }
                            }
                            break;

                        case 'pending':

                            if (newRec.type == 'purchaserequisition') {

                                var arrButtons = [{
                                    id: 'custpage_btn_submit',
                                    label: 'Cancel',
                                    functionName: 'cancel'
                                }];

                                createButton(form, newRec, arrButtons)
                            }
                            break;

                        case 'approval':

                            if (newRec.type == 'purchaserequisition') {

                                var arrButtons = [{
                                    id: 'custpage_btn_approve',
                                    label: 'Approve',
                                    functionName: newRec.type == 'purchaserequisition' ? 'procurementReview' : 'approve'
                                }, {
                                    id: 'custpage_btn_reject',
                                    label: 'Reject',
                                    functionName: 'reject'
                                }];

                                createButton(form, newRec, arrButtons)
                            }
                            break;

                        case 'approved':

                            if (newRec.type == 'purchaserequisition') {

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
                            form.removeButton('edit');
                            if(!isPRAdmin){

                                form.removeButton('custpageworkflow608');
                                form.removeButton('createpo');
                            }
                            break;

                        case undefined:
                            if(!isPRAdmin) {

                                form.removeButton('edit');
                            }
                            break;
                    }

                } else if (scriptContext.type == scriptContext.UserEventType.EDIT) {

                    var sStatus = approvalmatrix.current({
                        record: newRec.type,
                        recordid: newRec.id
                    });

                    log.audit('sStatus', sStatus)

                    switch (sStatus) {
                        case 'procurementreview' || 'spendscheduleupdated' || 'datachecked' || 'cancelled':
                            /*if (idUser == newRec.getValue('entity') || pr_adminroles.indexOf(runtime.getCurrentUser().role) == -1) {
                                var errMatrix = error.create({
                                    name: 'RECORD_LOCKED',
                                    message: "Record has been locked/You don't have permission to edit the record",
                                    notifyOff: true
                                });
                                throw errMatrix.message;
                            }*/
                            break;

                        case 'approved':
                            form.removeButton('edit');
                            break;
                    }

                }
            } catch (e) {
                log.error('beforeLoad:', e);
            }


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


            var newRec = scriptContext.newRecord;

            if (scriptContext.type == scriptContext.UserEventType.CREATE) {

                approvalmatrix.initialize({
                    record: newRec.type,
                    recordid: newRec.id
                });

            } else if (scriptContext.type == scriptContext.UserEventType.EDIT
                && runtime.executionContext === runtime.ContextType.USER_INTERFACE) {

                var sStatus = approvalmatrix.current({
                    record: newRec.type,
                    recordid: newRec.id
                });

                if (sStatus == 'pending' || sStatus == 'rejected' || sStatus == 'approval') {

                    approvalmatrix.initialize({
                        record: newRec.type,
                        recordid: newRec.id
                    });
                }
            }
        }

        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit
        };

    });
