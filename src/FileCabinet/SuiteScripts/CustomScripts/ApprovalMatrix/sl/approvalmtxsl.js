/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/file', 'N/query', 'N/currency', 'N/runtime', 'N/redirect', 'N/ui/serverWidget', '../api/approvalmatrix'],

    function (record, file, query, currency, runtime, redirect, serverWidget, approvalmatrix) {

        /**
         * Definition of the Suitelet script trigger point.
         *
         * @param {Object} context
         * @param {ServerRequest} context.request - Encapsulation of the incoming request
         * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
         * @Since 2015.2
         */

        function onRequest(context) {

            var paramReq = context.request.parameters;
            var sAction = paramReq.action;
            var sRecord = paramReq.record;
            var idRecord = paramReq.recordid;
            var objMatrix = {};

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
                objMatrix = arrMatrix[0];
            }

            var rec = record.load({
                type: sRecord,
                id: idRecord,
                isDynamic: true
            });

            switch (sAction) {
                case 'submit':

                    approvalmatrix.submit({
                        record: sRecord,
                        recordid: idRecord,
                        employee: runtime.getCurrentUser().id,
                        matrix: rec.getValue(objMatrix.matrixfield),
                        amount: rec.getValue(objMatrix.amountfield) * currency.exchangeRate({
                            source: rec.getValue('currency'),
                            target: 'USD',
                            date: new Date()
                        })
                    });
                    redirect.toRecord({
                        type: sRecord,
                        id: idRecord
                    });
                    break;

                case 'cancel':

                    approvalmatrix.cancel({
                        record: sRecord,
                        recordid: idRecord,
                        employee: runtime.getCurrentUser().id,
                        matrix: rec.getValue(objMatrix.matrixfield),
                        amount: rec.getValue(objMatrix.amountfield) * currency.exchangeRate({
                            source: rec.getValue('currency'),
                            target: 'USD',
                            date: new Date()
                        })
                    });
                    redirect.toRecord({
                        type: sRecord,
                        id: idRecord
                    });
                    break;

                case 'approve':

                    approvalmatrix.approve({
                        record: sRecord,
                        recordid: idRecord,
                        employee: runtime.getCurrentUser().id,
                        matrix: rec.getValue(objMatrix.matrixfield),
                        amount: rec.getValue(objMatrix.amountfield) * currency.exchangeRate({
                            source: rec.getValue('currency'),
                            target: 'USD',
                            date: new Date()
                        })
                    });
                    redirect.toRecord({
                        type: sRecord,
                        id: idRecord
                    });
                    break;

                case 'reject':

                    if (context.request.method === 'GET') {

                        var form = serverWidget.createForm({title: 'Reject', hideNavBar: true});

                        var fldRecType = form.addField({
                            id: 'record',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Record: '
                        }).updateDisplayType({
                            displayType: 'HIDDEN'
                        });
                        fldRecType.defaultValue = sRecord;

                        var fldRecId = form.addField({
                            id: 'recordid',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Record ID: '
                        }).updateDisplayType({
                            displayType: 'HIDDEN'
                        });
                        fldRecId.defaultValue = idRecord;
                        var fldAction = form.addField({
                            id: 'action',
                            type: serverWidget.FieldType.TEXT,
                            label: 'Action: '
                        }).updateDisplayType({
                            displayType: 'HIDDEN'
                        });
                        fldAction.defaultValue = sAction;

                        form.addField({
                            id: 'custpage_note',
                            type: serverWidget.FieldType.TEXTAREA,
                            label: 'Enter Notes: '
                        });

                        form.addSubmitButton({
                            label: 'Reject'
                        });

                        context.response.writePage(form);
                    } else if (context.request.method === 'POST') {
                        var stNotes = context.request.parameters.custpage_note;

                        if (stNotes) {
                            approvalmatrix.reject({
                                record: sRecord,
                                recordid: idRecord,
                                employee: runtime.getCurrentUser().id,
                                matrix: rec.getValue(objMatrix.matrixfield),
                                amount: rec.getValue(objMatrix.amountfield) * currency.exchangeRate({
                                    source: rec.getValue('currency'),
                                    target: 'USD',
                                    date: new Date()
                                }),
                                notes: stNotes
                            });

                            context.response.write('Record has been Rejected.');
                        }
                    }
                    break;

                case 'procurementreview':

                    approvalmatrix.procurementReview({
                        record: sRecord,
                        recordid: idRecord,
                        employee: runtime.getCurrentUser().id,
                        matrix: rec.getValue(objMatrix.matrixfield),
                        amount: rec.getValue(objMatrix.amountfield) * currency.exchangeRate({
                            source: rec.getValue('currency'),
                            target: 'USD',
                            date: new Date()
                        })
                    });
                    redirect.toRecord({
                        type: sRecord,
                        id: idRecord
                    });
                    break;

                case 'spendschedupdated':

                    approvalmatrix.spendScheduleUpdated({
                        record: sRecord,
                        recordid: idRecord,
                        employee: runtime.getCurrentUser().id,
                        matrix: rec.getValue(objMatrix.matrixfield),
                        amount: rec.getValue(objMatrix.amountfield) * currency.exchangeRate({
                            source: rec.getValue('currency'),
                            target: 'USD',
                            date: new Date()
                        })
                    });
                    redirect.toRecord({
                        type: sRecord,
                        id: idRecord
                    });
                    break;

                case 'datachecked':

                    approvalmatrix.dataChecked({
                        record: sRecord,
                        recordid: idRecord,
                        employee: runtime.getCurrentUser().id,
                        matrix: rec.getValue(objMatrix.matrixfield),
                        amount: rec.getValue(objMatrix.amountfield) * currency.exchangeRate({
                            source: rec.getValue('currency'),
                            target: 'USD',
                            date: new Date()
                        })
                    });
                    redirect.toRecord({
                        type: sRecord,
                        id: idRecord
                    });
                    break;
            }

            /*if (sAction == 'submit') {

                var rec = record.load({
                    type: sRecord,
                    id: idRecord,
                    isDynamic: true
                });

                approvalmatrix.submit({
                    record: sRecord,
                    recordid: idRecord,
                    employee: runtime.getCurrentUser().id,
                    matrix: rec.getValue(objMatrix.matrixfield),
                    amount: rec.getValue(objMatrix.amountfield) * currency.exchangeRate({
                        source: rec.getValue('currency'),
                        target: 'USD',
                        date: new Date()
                    })
                });

                redirect.toRecord({
                    type: sRecord,
                    id: idRecord
                });
            }
            else if(sAction == 'cancel'){

                var rec = record.load({
                    type: sRecord,
                    id: idRecord,
                    isDynamic: true
                });

                approvalmatrix.cancel({
                    record: sRecord,
                    recordid: idRecord,
                    employee: runtime.getCurrentUser().id,
                    matrix: rec.getValue(objMatrix.matrixfield),
                    amount: rec.getValue(objMatrix.amountfield) * currency.exchangeRate({
                        source: rec.getValue('currency'),
                        target: 'USD',
                        date: new Date()
                    })
                });

                redirect.toRecord({
                    type: sRecord,
                    id: idRecord
                });

            }
            else if (sAction == 'approve') {

                var rec = record.load({
                    type: sRecord,
                    id: idRecord,
                    isDynamic: true
                });

                approvalmatrix.approve({
                    record: sRecord,
                    recordid: idRecord,
                    employee: runtime.getCurrentUser().id,
                    matrix: rec.getValue(objMatrix.matrixfield),
                    amount: rec.getValue(objMatrix.amountfield) * currency.exchangeRate({
                        source: rec.getValue('currency'),
                        target: 'USD',
                        date: new Date()
                    })
                });

                redirect.toRecord({
                    type: sRecord,
                    id: idRecord
                });
            }
            else if (sAction == 'reject') {

                var rec = record.load({
                    type: sRecord,
                    id: idRecord,
                    isDynamic: true
                });

                if (context.request.method === 'GET') {

                    var form = serverWidget.createForm({title: 'Reject', hideNavBar: true});

                    var fldRecType = form.addField({
                        id: 'record',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Record: '
                    }).updateDisplayType({
                        displayType: 'HIDDEN'
                    });
                    fldRecType.defaultValue = sRecord;

                    var fldRecId = form.addField({
                        id: 'recordid',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Record ID: '
                    }).updateDisplayType({
                        displayType: 'HIDDEN'
                    });
                    fldRecId.defaultValue = idRecord;
                    var fldAction = form.addField({
                        id: 'action',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Action: '
                    }).updateDisplayType({
                        displayType: 'HIDDEN'
                    });
                    fldAction.defaultValue = sAction;

                    form.addField({
                        id: 'custpage_note',
                        type: serverWidget.FieldType.TEXTAREA,
                        label: 'Enter Notes: '
                    });

                    form.addSubmitButton({
                        label: 'Reject'
                    });

                    context.response.writePage(form);
                } else if (context.request.method === 'POST') {
                    var stNotes = context.request.parameters.custpage_note;

                    if (stNotes) {
                        approvalmatrix.reject({
                            record: sRecord,
                            recordid: idRecord,
                            employee: runtime.getCurrentUser().id,
                            matrix: rec.getValue(objMatrix.matrixfield),
                            amount: rec.getValue(objMatrix.amountfield) * currency.exchangeRate({
                                source: rec.getValue('currency'),
                                target: 'USD',
                                date: new Date()
                            }),
                            notes: stNotes
                        });

                        context.response.write('Record has been Rejected.');
                    }
                }
            }
            else if (sAction == 'procurementreview') {

                var rec = record.load({
                    type: sRecord,
                    id: idRecord,
                    isDynamic: true
                });

                approvalmatrix.procurementReview({
                    record: sRecord,
                    recordid: idRecord,
                    employee: runtime.getCurrentUser().id,
                    matrix: rec.getValue(objMatrix.matrixfield),
                    amount: rec.getValue(objMatrix.amountfield) * currency.exchangeRate({
                        source: rec.getValue('currency'),
                        target: 'USD',
                        date: new Date()
                    })
                });

                redirect.toRecord({
                    type: sRecord,
                    id: idRecord
                });
            }
            else if (sAction == 'spendschedupdated') {

                var rec = record.load({
                    type: sRecord,
                    id: idRecord,
                    isDynamic: true
                });

                approvalmatrix.spendScheduleUpdated({
                    record: sRecord,
                    recordid: idRecord,
                    employee: runtime.getCurrentUser().id,
                    matrix: rec.getValue(objMatrix.matrixfield),
                    amount: rec.getValue(objMatrix.amountfield) * currency.exchangeRate({
                        source: rec.getValue('currency'),
                        target: 'USD',
                        date: new Date()
                    })
                });

                redirect.toRecord({
                    type: sRecord,
                    id: idRecord
                });
            }
            else if (sAction == 'datachecked') {

                var rec = record.load({
                    type: sRecord,
                    id: idRecord,
                    isDynamic: true
                });

                approvalmatrix.dataChecked({
                    record: sRecord,
                    recordid: idRecord,
                    employee: runtime.getCurrentUser().id,
                    matrix: rec.getValue(objMatrix.matrixfield),
                    amount: rec.getValue(objMatrix.amountfield) * currency.exchangeRate({
                        source: rec.getValue('currency'),
                        target: 'USD',
                        date: new Date()
                    })
                });

                redirect.toRecord({
                    type: sRecord,
                    id: idRecord
                });
            }*/


        }

        return {
            onRequest: onRequest
        };

    });
