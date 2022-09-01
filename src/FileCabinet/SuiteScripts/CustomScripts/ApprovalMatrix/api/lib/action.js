define(['N/email', 'N/record', 'N/file', 'N/query', 'N/runtime', './matrix', './approver','./approvalmxtaccess'],

    function (email, record, file, query, runtime, matrix, approver,approvalmxtaccess) {
        var idUser = runtime.getCurrentUser().id;

        initialize = function (option) {

            var idRecord = option.recordid;
            var sRecord = option.record;

            var sSql = file.load({
                id: 303650 //matrix.sql
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
                    value: 1
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

            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });

            rec.setValue({
                fieldId: objApprover.approverfield,
                //value: objApprover.approver
                value: 1060242
            });

            rec.setValue({
                fieldId: objApprover.statusfield,
                value: 1//pending approval
            });

            rec.setValue({
                fieldId: objApprover.matrixstatusfield,
                value: 3//pending approval
            });

            var stBody = "<br />Hi " + rec.getText('nextapprover') + ", You have a Purchase Request to Approve. <br /><br />";
            stBody += "<a href='app/accounting/transactions/purchreq.nl?id=" + option.recordid + "'>View Purchase Request.</a>"

            objData = {
                recipientId: rec.getValue('nextapprover'),
                body: stBody
            }

            sendEmailNotification(objData, rec);

            rec.save();

        };

        edit = function (option) {

            var objApprover = approver.nextManager(option);

            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });

            rec.setValue({
                fieldId: objApprover.approverfield,
                value: ''
            });

            rec.setValue({
                fieldId: objApprover.statusfield,
                value: 1//pending approval
            });

            rec.setValue({
                fieldId: objApprover.matrixstatusfield,
                value: 1//not submitted
            });

            rec.save();

        };

        cancel = function (option) {

            var objApprover = approver.nextManager(option);

            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });

            rec.setValue({
                fieldId: objApprover.approverfield,
                value: ''
            });

            rec.setValue({
                fieldId: objApprover.statusfield,
                value: 3//rejected
            });

            rec.setValue({
                fieldId: objApprover.matrixstatusfield,
                value: 2//Cancelled
            });

            rec.save();

        };

        approve = function (option) {
            var objData = {};
            var objApprover = approver.nextManager(option);

            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });

            var stBody = "<br />Your Purchase Request has been approved by " + rec.getText('nextapprover') + "<br /><br />";
            stBody += "<a href='app/accounting/transactions/purchreq.nl?id=" + option.recordid + "'>View Purchase Request.</a>"

            rec.setValue({
                fieldId: objApprover.approverfield,
                value: ''
            });

            rec.setValue({
                fieldId: objApprover.statusfield,
                value: 2//approved
            });

            rec.setValue({
                fieldId: objApprover.matrixstatusfield,
                value: 5//approved
            });

            objData = {
                recipientId: rec.getValue('entity'),
                body: stBody
            }

            sendEmailNotification(objData, rec);

            rec.save();

        };

        reject = function (option) {
            var objData = {};
            var objApprover = approver.nextManager(option);

            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });

            var stBody = "<br />Your Purchase Request has been rejected by " + rec.getText('nextapprover') + "<br /><br />";
            stBody += "Reject notes: " + option.notes + "<br /><br />";
            stBody += "<a href='app/accounting/transactions/purchreq.nl?id=" + option.recordid + "'>View Purchase Request.</a>"

            rec.setValue({
                fieldId: objApprover.approverfield,
                value: ''
            });

            rec.setValue({
                fieldId: objApprover.statusfield,
                value: 3
            });

            rec.setValue({
                fieldId: objApprover.matrixstatusfield,
                value: 6
            });

            // rec.setValue({
            //     fieldId: 'custbody_purchase_notes',
            //     value: option.notes
            // });

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
            var objApprover = approver.nextManager(option);

            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });

            var stBody = "<br />Your Purchase Request has been approved by " + rec.getText('nextapprover') + "<br /><br />";
            stBody += "<a href='app/accounting/transactions/purchreq.nl?id=" + option.recordid + "'>View Purchase Request.</a>"

            rec.setValue({
                fieldId: objApprover.approverfield,
                value: ''
            });

            rec.setValue({
                fieldId: objApprover.statusfield,
                value: 2//approved
            });

            rec.setValue({
                fieldId: objApprover.matrixstatusfield,
                value: 7//Procurement Review Needed
            });

            objData = {
                recipientId: rec.getValue('entity'),
                body: stBody
            }

            sendEmailNotification(objData, rec);

            rec.save();

        };

        spendScheduleUpdated = function (option) {
            var objData = {};
            var objApprover = approver.nextManager(option);

            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });

            var stBody = "<br />Your Purchase Request has been approved by " + rec.getText('nextapprover') + "<br /><br />";
            stBody += "<a href='app/accounting/transactions/purchreq.nl?id=" + option.recordid + "'>View Purchase Request.</a>"

            var prevStatus=rec.getValue({
                fieldId: objApprover.matrixstatusfield
            });

            rec.setValue({
                fieldId: objApprover.approverfield,
                value: ''
            });

            rec.setValue({
                fieldId: objApprover.statusfield,
                value: 2//approved
            });

            if(prevStatus==7){
                rec.setValue({
                    fieldId: objApprover.matrixstatusfield,
                    value: 8//Spend Schedule Reviewed
                });
            }else if(prevStatus==9){
                rec.setValue({
                    fieldId: objApprover.matrixstatusfield,
                    value: 5//Approved
                });
            }


            objData = {
                recipientId: rec.getValue('entity'),
                body: stBody
            }

            //sendEmailNotification(objData, rec);

            rec.save();

        };

        dataChecked = function (option) {
            var objData = {};
            var objApprover = approver.nextManager(option);

            var rec = record.load({
                type: option.record,
                id: option.recordid,
                isDynamic: true
            });

            var stBody = "<br />Your Purchase Request has been approved by " + rec.getText('nextapprover') + "<br /><br />";
            stBody += "<a href='app/accounting/transactions/purchreq.nl?id=" + option.recordid + "'>View Purchase Request.</a>"

            var prevStatus=rec.getValue({
                fieldId: objApprover.matrixstatusfield
            });

            rec.setValue({
                fieldId: objApprover.approverfield,
                value: ''
            });

            rec.setValue({
                fieldId: objApprover.statusfield,
                value: 2//approved
            });

            if(prevStatus==7){
                rec.setValue({
                    fieldId: objApprover.matrixstatusfield,
                    value: 9//Data Checked
                });
            }else if(prevStatus==8){
                rec.setValue({
                    fieldId: objApprover.matrixstatusfield,
                    value: 5//Approved
                });
            }


            objData = {
                recipientId: rec.getValue('entity'),
                body: stBody
            }

            //sendEmailNotification(objData, rec);

            rec.save();

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
                id: 303650 //matrix.sql
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

                // var idUser = runtime.getCurrentUser().id;
                var isPRAdmin = approvalmxtaccess.getRequisitionAdminAccess(
                    {
                        custparam: {
                            userid: idUser
                        }
                    }
                )

                if (rec.getValue(objMatrix.matrixstatusfield) == 1) {
                    if (idUser == rec.getValue(objMatrix.ownerfield)) {
                        return 'submit';
                    }
                } else if (rec.getValue(objMatrix.matrixstatusfield) == 2) {
                    if (idUser == rec.getValue(objMatrix.ownerfield)) {
                        return 'cancelled';
                    }
                } else if (rec.getValue(objMatrix.matrixstatusfield) == 3) {
                    if (idUser == rec.getValue(objMatrix.approverfield)) {
                        return 'approval';
                    } else if (idUser == rec.getValue(objMatrix.ownerfield)) {
                        return 'pending';
                    }
                } else if (rec.getValue(objMatrix.matrixstatusfield) == 5) {

                    if (idUser == rec.getValue(objMatrix.ownerfield)) {
                        return 'approved';
                    }else if(isPRAdmin && idUser != rec.getValue(objMatrix.ownerfield)){
                        return 'approved';
                    }
                } else if (rec.getValue(objMatrix.matrixstatusfield) == 6) {

                    if (idUser == rec.getValue(objMatrix.ownerfield)) {
                        return 'rejected';
                    }
                }else if (rec.getValue(objMatrix.matrixstatusfield) == 7) {
                    log.audit('isPRAdmin',isPRAdmin)
                    if (idUser == rec.getValue(objMatrix.ownerfield)) {
                        return 'procurementreview';
                    }else if(isPRAdmin ){
                        return 'procurementreview';
                    }
                }else if (rec.getValue(objMatrix.matrixstatusfield) == 8) {

                    if (idUser == rec.getValue(objMatrix.ownerfield)) {
                        return 'spendscheduleupdated';
                    }else if(isPRAdmin && idUser != rec.getValue(objMatrix.ownerfield)){
                        return 'spendscheduleupdated';
                    }
                }else if (rec.getValue(objMatrix.matrixstatusfield) == 9) {

                    if (idUser == rec.getValue(objMatrix.ownerfield)) {
                        return 'datachecked';
                    }else if(isPRAdmin && idUser != rec.getValue(objMatrix.ownerfield)){
                        return 'datachecked';
                    }
                }

            }
        };

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
                value: 7
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
            /*log.audit('objRecord', objRecord);
            log.audit('id', id);*/
        }

        return {
            initialize: initialize,
            submit: submit,
            edit: edit,
            approve: approve,
            reject: reject,
            current: current,
            cancel:cancel,
            procurementReview:procurementReview,
            spendScheduleUpdated:spendScheduleUpdated,
            dataChecked:dataChecked
        };

    });
