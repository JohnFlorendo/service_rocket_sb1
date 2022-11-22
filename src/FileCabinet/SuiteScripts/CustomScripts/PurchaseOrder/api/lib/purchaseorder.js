/**
 * @NApiVersion 2.1
 */
define(['N/record', 'N/search', 'N/file', 'N/query'],
    /**
     * @param{record} record
     * @param{search} search
     * @param{file} file
     * @param{query} query
     */
    (record, search, file, query) => {
        const setExpiryDate = (newRecord) => {
            try {

                var inPrId = newRecord.getValue({
                    fieldId: 'createdfrom'
                })

                if (inPrId) {
                    var objPrExpiry = search.lookupFields({
                        type: search.Type.PURCHASE_REQUISITION,
                        id: inPrId,
                        columns: ['custbody_sr_expiry_date']
                    });

                }
            } catch (e) {
                log.error('setExpiryDate', e)
            }

        }
        const setLineTaxCodes = (newRecord) => {
            var isTransform = newRecord.getValue({
                fieldId: 'transform'
            });

            if (isTransform) {
                var recPurchaseOrder = record.load({
                    type: newRecord.type,
                    id: newRecord.id,
                    isDynamic: true
                });

                var inLine = recPurchaseOrder.getLineCount({
                    sublistId: 'item'
                });
                for (var indx = 0; indx < inLine; indx++) {
                    var inGSTCode = recPurchaseOrder.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_gst_taxcode',
                        line: indx
                    });

                    if (inGSTCode) {
                        recPurchaseOrder.selectLine({
                            sublistId: 'item',
                            line: indx
                        });
                        recPurchaseOrder.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'taxcode',
                            value: inGSTCode
                        });
                        recPurchaseOrder.commitLine({
                            sublistId: 'item'
                        });
                    }
                }

                var id = recPurchaseOrder.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });

            }
        }

        const setLineActivityCodes = (newRecord, contextType) => {
            try {
                if (contextType != 'create') return;

                var createdFrom = newRecord.getValue({
                    fieldId: 'createdfrom'
                });

                var prDocumentNumber = newRecord.getValue({
                    fieldId: 'custbody_sr_budget_code'
                });

                if (!createdFrom && !prDocumentNumber) return;

                var arrItemActivityCodes = getActivityCodes(createdFrom, prDocumentNumber)
                log.debug('getActivityCodes', arrItemActivityCodes)
                log.debug('contextType', contextType)
                for (var index in arrItemActivityCodes) {
                    var itemLine;

                    itemLine = newRecord.findSublistLineWithValue({
                        sublistId: 'item',
                        fieldId: 'line',
                        value: arrItemActivityCodes[index].line
                    });
                    if (itemLine != -1) {
                        newRecord.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_lineidreference',
                            value: arrItemActivityCodes[index].line,
                            line: itemLine
                        });
                    }

                    if (itemLine != -1) {
                        log.debug(itemLine, arrItemActivityCodes[index])
                        newRecord.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'cseg_paactivitycode',
                            value: arrItemActivityCodes[index].activitycode,
                            line: itemLine
                        });

                    }

                }

            } catch (e) {
                log.error('setLineActivityCodes: Error:', e)
            }
        }

        const setLineActivityCodesEditMode = (newRecord, contextType) => {
            try {
                if (contextType != 'edit') return;

                var createdFrom = newRecord.getValue({
                    fieldId: 'createdfrom'
                });

                var prDocumentNumber = newRecord.getValue({
                    fieldId: 'custbody_sr_budget_code'
                });

                if (!createdFrom && !prDocumentNumber) return;

                var arrItemActivityCodes = getActivityCodes(createdFrom, prDocumentNumber)
                log.debug('getActivityCodes', arrItemActivityCodes)
                log.debug('contextType', contextType)
                for (var index in arrItemActivityCodes) {
                    var itemLine;

                    itemLine = newRecord.findSublistLineWithValue({
                        sublistId: 'item',
                        fieldId: 'custcol_lineidreference',
                        value: Number(arrItemActivityCodes[index].line)
                    });

                    if (itemLine != -1) {
                        log.debug(itemLine, arrItemActivityCodes[index])
                        newRecord.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'cseg_paactivitycode',
                            value: arrItemActivityCodes[index].activitycode,
                            line: itemLine
                        });

                    }

                }

                newRecord.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });


            } catch (e) {
                log.error('setLineActivityCodes: Error:', e)
            }
        }

        const getActivityCodes = (createdFrom, prDocumentNumber) => {

            var sSql = file.load({
                id: createdFrom ? '../../sql/activitycodesbyid.sql' : '../../sql/activitycodesbytranid.sql'
            }).getContents();


            log.audit('sSql: ' + createdFrom + '_' + prDocumentNumber, sSql)
            var arrItemActivityCodes = query.runSuiteQL({
                query: sSql,
                params: createdFrom ? [createdFrom] : [prDocumentNumber]
            }).asMappedResults();

            log.debug('arrItemActivityCodes', arrItemActivityCodes)

            return arrItemActivityCodes;
        }

        return {setLineTaxCodes, setExpiryDate, setLineActivityCodes,setLineActivityCodesEditMode}

    });
