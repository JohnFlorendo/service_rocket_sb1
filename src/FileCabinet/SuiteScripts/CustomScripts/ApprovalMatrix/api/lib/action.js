define(['N/email', 'N/record', 'N/file', 'N/query', 'N/runtime', './matrix', './approver', './approvalmxtaccess'],

    function (email, record, file, query, runtime, matrix, approver, approvalmxtaccess) {
        var idUser = runtime.getCurrentUser().id;
        var nameUser = runtime.getCurrentUser().name;
        var userRole = runtime.getCurrentUser().role;
        var approvalStatus = getApprovalStatus();

        const requsitionRole = 1181;

        initialize = function (option) {

            var idRecord = option.recordid;
            var sRecord = option.record;

            var sSql = file.load({
                id: '../../sql/matrix.sql'
            }).getContents();

            var custParam = {
                paramrecord: sRecord,
            };

            var regx = new RegExp(Object.keys(custParam).join("|"), "gi");
            sSql = sSql.replace(regx, function (matched) {
                return custParam[matched];
            });

            var arrMatrix = query.runSuiteQL({
                query: sSql
            }).asMappedResults();


            if (arrMatrix.length > 0) {

                var objMatrix = arrMatrix[0];

                var rec = record.load({
                    type: sRecord,
                    id: idRecord,
                    isDynamic: true
                });

                rec.setValue({
                    fieldId: objMatrix.matrixfield,
                    value: objMatrix.matrix
                });

                rec.setValue({
                    fieldId: objMatrix.statusfield,
                    value: 1
                });

                rec.setValue({
                    fieldId: objMatrix.matrixstatusfield,
                    value: approvalStatus['Not Submitted']
                });

                rec.setValue({
                    fieldId: objMatrix.approverfield,
                    value: ''
                });

                rec.setValue({
                    fieldId: objMatrix.levelfield,
                    value: 0
                });

                rec.save();
            }

            return;

        };

        submit = function (option) {
            var objData = {};
            var objApprover = approver.nextManager(option);
            log.audit('option', option)
            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });

            if(objApprover != undefined) {
                rec.setValue({
                    fieldId: objApprover.approverfield,
                    value: objApprover.approver

                });

                rec.setValue({
                    fieldId: objApprover.statusfield,
                    value: 1//pending approval
                });

                rec.setValue({
                    fieldId: objApprover.matrixstatusfield,
                    value: approvalStatus['Pending Approval']
                });


                var stBody = generateTemplate({
                    header: "Hi " + rec.getText('nextapprover') + "<br/>You have a Purchase Requisition request to Approve",
                    body: "<p><b>Description: </b>" + rec.getText('memo') + "</p>" +
                        "<p><b>Notes and Supporting Info: </b>" + rec.getText('custbody_purchase_notes') + "</p>",
                    recordid: option.recordid
                });

                objData = {
                    recipientId: rec.getValue('nextapprover'),
                    body: stBody
                }

                sendEmailNotification(objData, rec);

                rec.save();
            } else {
                var objMatrix = matrix.get(option.record);

                rec.setValue({
                    fieldId: objMatrix.statusfield,
                    value: 1//pending approval
                });

                rec.setValue({
                    fieldId: objMatrix.matrixstatusfield,
                    value: approvalStatus['Pending Approval']
                });

                rec.save();
            }
        };

        edit = function (option) {
            var objMatrix = matrix.get(option.record);

            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });

            rec.setValue({
                fieldId: objMatrix.approverfield,
                value: ''
            });

            rec.setValue({
                fieldId: objMatrix.statusfield,
                value: 1//pending approval
            });

            rec.setValue({
                fieldId: objMatrix.matrixstatusfield,
                value: approvalStatus['Not Submitted']
            });

            rec.save();

        };

        cancel = function (option) {
            var objMatrix = matrix.get(option.record);

            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });

            rec.setValue({
                fieldId: objMatrix.approverfield,
                value: ''
            });

            rec.setValue({
                fieldId: objMatrix.statusfield,
                value: 3//rejected
            });

            rec.setValue({
                fieldId: objMatrix.matrixstatusfield,
                value: approvalStatus['Cancelled']
            });

            rec.save();

        };

        approve = function (option) {
            var objData = {};
            var isRequisitionRole = userRole == requsitionRole;

            var objApprover = approver.nextManager(option);
            log.audit('objApprover', objApprover);

            var objMatrix = matrix.get(option.record);

            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });

            if (objApprover != undefined && rec.getValue('custbody_sequentialapproval') == true && !isRequisitionRole) {

                var stBody = generateTemplate({
                    header: "Hi " + rec.getText('nextapprover') + "<br/>You have a Purchase Requisition request to Approve",
                    body: "<p><b>Description: </b>" + rec.getText('memo') + "</p>" +
                        "<p><b>Notes and Supporting Info: </b>" + rec.getText('custbody_purchase_notes') + "</p>",
                    recordid: option.recordid
                });

                rec.setValue({
                    fieldId: objMatrix.approverfield,
                    value: objApprover.approver
                });

                rec.setValue({
                    fieldId: objMatrix.statusfield,
                    value: 1//pending approval
                });

                rec.setValue({
                    fieldId: objMatrix.matrixstatusfield,
                    value: approvalStatus['Pending Approval']
                });

                objData = {
                    recipientId: rec.getValue('nextapprover'),
                    body: stBody
                }

            } else {

                var stBody = generateTemplate({
                    header: "Your Purchase Requisition request has been approved by " + nameUser,
                    body: "<p><b>Description: </b>" + rec.getText('memo') + "</p>" +
                        "<p><b>Notes and Supporting Info: </b>" + rec.getText('custbody_purchase_notes') + "</p>",
                    recordid: option.recordid
                });

                rec.setValue({
                    fieldId: objMatrix.approverfield,
                    value: ''
                });

                rec.setValue({
                    fieldId: objMatrix.statusfield,
                    value: 2//approved
                });

                rec.setValue({
                    fieldId: objMatrix.matrixstatusfield,
                    value: approvalStatus['Approved']
                });

                objData = {
                    recipientId: rec.getValue('entity'),
                    body: stBody
                }

            }

            sendEmailNotification(objData, rec);

            rec.save();

        };

        reject = function (option) {
            var objData = {};
            var objMatrix = matrix.get(option.record);

            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });

            var stBody = generateTemplate({
                header: "Your Purchase Requisition request has been rejected by " + nameUser,
                body: "<p><b>Rejection Reason:</b>" + option.notes + "</p>",
                recordid: option.recordid
            });

            rec.setValue({
                fieldId: objMatrix.approverfield,
                value: ''
            });

            rec.setValue({
                fieldId: objMatrix.statusfield,
                value: 3
            });

            rec.setValue({
                fieldId: objMatrix.matrixstatusfield,
                value: approvalStatus['Rejected']
            });

            createNoteForReject(option);

            objData = {
                recipientId: rec.getValue('entity'),
                body: stBody
            }

            sendEmailNotification(objData, rec);

            rec.save();

        };

        procurementReview = function (option) {
            var objData = {};
            var isRequisitionRole = userRole == requsitionRole;

            var objApprover = approver.nextManager(option);
            log.audit('objApprover', objApprover);

            var objMatrix = matrix.get(option.record);

            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });

            if (objApprover != undefined && rec.getValue('custbody_sequentialapproval') == true && !isRequisitionRole) {

                var stBody = generateTemplate({
                    header: "Hi " + rec.getText('nextapprover') + "<br/>You have a Purchase Requisition request to Approve",
                    body: "<p><b>Description: </b>" + rec.getText('memo') + "</p>" +
                        "<p><b>Notes and Supporting Info: </b>" + rec.getText('custbody_purchase_notes') + "</p>",
                    recordid: option.recordid
                });

                rec.setValue({
                    fieldId: objMatrix.approverfield,
                    value: objApprover.approver
                });

                rec.setValue({
                    fieldId: objMatrix.statusfield,
                    value: 1//pending approval
                });

                rec.setValue({
                    fieldId: objMatrix.matrixstatusfield,
                    value: approvalStatus['Pending Approval']
                });

                objData = {
                    recipientId: rec.getValue('nextapprover'),
                    body: stBody
                }

            } else {

                var stBody = generateTemplate({
                    header: "Your Purchase Requisition request has been approved by " + nameUser,
                    body: "<p><b>Description: </b>" + rec.getText('memo') + "</p>" +
                        "<p><b>Notes and Supporting Info: </b>" + rec.getText('custbody_purchase_notes') + "</p>",
                    recordid: option.recordid
                });

                rec.setValue({
                    fieldId: objMatrix.approverfield,
                    value: ''
                });

                rec.setValue({
                    fieldId: objMatrix.statusfield,
                    value: 2//approved
                });

                rec.setValue({
                    fieldId: objMatrix.matrixstatusfield,
                    value: approvalStatus['Procurement Review Needed']
                });

                objData = {
                    recipientId: rec.getValue('entity'),
                    body: stBody
                }

            }

            sendEmailNotification(objData, rec);

            rec.save();

        };

        spendScheduleUpdated = function (option) {
            var objMatrix = matrix.get(option.record);

            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });

            var prevStatus = rec.getValue({
                fieldId: objMatrix.matrixstatusfield
            });

            rec.setValue({
                fieldId: objMatrix.approverfield,
                value: ''
            });

            rec.setValue({
                fieldId: objMatrix.statusfield,
                value: 2//approved
            });

            if (prevStatus == 7) {
                rec.setValue({
                    fieldId: objMatrix.matrixstatusfield,
                    value: approvalStatus['Spend Schedule Reviewed']
                });
            } else if (prevStatus == 9) {
                rec.setValue({
                    fieldId: objMatrix.matrixstatusfield,
                    value: approvalStatus['Approved']
                });
            }

            rec.save();
        };

        dataChecked = function (option) {
            var objMatrix = matrix.get(option.record);

            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });

            var prevStatus = rec.getValue({
                fieldId: objMatrix.matrixstatusfield
            });

            rec.setValue({
                fieldId: objMatrix.approverfield,
                value: ''
            });

            rec.setValue({
                fieldId: objMatrix.statusfield,
                value: 2//approved
            });

            if (prevStatus == 7) {
                rec.setValue({
                    fieldId: objMatrix.matrixstatusfield,
                    value: approvalStatus['Data Checked']
                });
            } else if (prevStatus == 8) {
                rec.setValue({
                    fieldId: objMatrix.matrixstatusfield,
                    value: approvalStatus['Approved']
                });
            }

            rec.save();

        };

        getPOStatus = function (option) {

            var idRecord = option.recordid;

            var sSql = file.load({
                id: '../../sql/linkedtransactions.sql'
            }).getContents();

            var arrLinkedTx = query.runSuiteQL({
                query: sSql,
                params: [idRecord]
            }).asMappedResults();

            return arrLinkedTx.length;
        };

        current = function (option) {
            var idRecord = option.recordid;
            var sRecord = option.record;

            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });


            var sSql = file.load({
                id: '../../sql/matrix.sql'
            }).getContents();

            var custParam = {
                paramrecord: sRecord,
            };

            var regx = new RegExp(Object.keys(custParam).join("|"), "gi");
            sSql = sSql.replace(regx, function (matched) {
                return custParam[matched];
            });

            var arrMatrix = query.runSuiteQL({
                query: sSql
            }).asMappedResults();


            if (arrMatrix.length > 0) {

                var objMatrix = arrMatrix[0];

                var isPRAdmin = approvalmxtaccess.getRequisitionAdminAccess(
                    {
                        custparam: {
                            userid: idUser
                        }
                    }
                )
                log.audit(rec.getValue(objMatrix.matrixstatusfield))
                switch (rec.getValue(objMatrix.matrixstatusfield).toString()) {
                    case '1':
                        if (idUser == rec.getValue(objMatrix.ownerfield)) {
                            return 'submit';
                        }
                        break;
                    case '2':
                        return 'cancelled';
                        break;
                    case '3':
                        if (idUser == rec.getValue(objMatrix.approverfield)) {
                            return 'approval';
                        } else {
                            return 'pending';
                        }
                        break;
                    case '5':
                        if (getPOStatus(option)) {
                            return 'po_pending';
                        } else {
                            return 'approved';
                        }
                        break;
                    case '6':
                        return 'rejected';
                        break;
                    case '7':
                        return 'procurementreview';
                        break;
                    case '8':
                        return 'spendscheduleupdated';
                        break;
                    case '9':
                        return 'datachecked';
                        break;
                }

            }
        };

        function generateTemplate(option) {
            var template = file.load({
                id: '../../template/emailnotification.html'
            }).getContents();

            template = template.replace('{header}', option.header)
            template = template.replace('{body}', option.body)
            template = template.replace('{recordid}', option.recordid)

            return template;
        }

        function sendEmailNotification(objData, rec) {
            email.send({
                author: idUser,
                recipients: objData.recipientId,
                subject: rec.getValue('tranid'),
                body: objData.body
            });
        }

        function createNoteForReject(option) {
            var objRecord = record.create({
                type: record.Type.NOTE,
                isDynamic: true
            });
            objRecord.setValue({
                fieldId: 'title',
                value: 'Rejected'
            });
            objRecord.setValue({
                fieldId: 'notetype',
                value: 9 // System Note - APM (non-editable)
            });
            objRecord.setValue({
                fieldId: 'note',
                value: option.notes
            });
            objRecord.setValue({
                fieldId: 'transaction',
                value: option.recordid
            });

            var id = objRecord.save();
        }

        function getApprovalStatus() {
            var approvalStatusMapping = {};
            var sSql = file.load({
                id: '../../sql/approvalstatus.sql'
            }).getContents();

            var arrApprovalStatus = query.runSuiteQL({
                query: sSql
            }).asMappedResults();

            for (var item in arrApprovalStatus) {
                var mapping = arrApprovalStatus[item];
                approvalStatusMapping[mapping.name] = mapping.id
            }

            return approvalStatusMapping;
        }

        return {
            initialize: initialize,
            submit: submit,
            edit: edit,
            approve: approve,
            reject: reject,
            current: current,
            cancel: cancel,
            procurementReview: procurementReview,
            spendScheduleUpdated: spendScheduleUpdated,
            dataChecked: dataChecked
        };

    });
