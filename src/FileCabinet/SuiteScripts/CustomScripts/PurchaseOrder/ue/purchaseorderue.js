/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */

/*
Purpose             : Render a Custom Button for Printing Transaction
Created On          : February 14, 2022
Author              : Ceana Technology
Saved Searches      : N/A
*/

define(['N/record', 'N/search', 'N/url', '../api/purchaseorder', 'N/ui/serverWidget', "N/currency", "N/runtime", 'N/query'],
    (record, search, url, purchaseorder, serverWidget, currency, runtime, query) => {

        const beforeLoad = (scriptContext) => {
            var newRecord = scriptContext.newRecord;
            var scriptObj = runtime.getCurrentScript();
            try {
                var relatedRecordCount = newRecord.getLineCount({sublistId: 'links'})
                var bills = []
                for (var ctr = 0; ctr < relatedRecordCount; ctr++) {
                    var tranID = newRecord.getSublistValue({sublistId: 'links', fieldId: 'id', line: ctr});
                    bills.push(tranID)
                }
                var currencycodes = getCurrencies();
                // var gst = gettotalGST({newRecord,currencycodes});
                // log.debug('gst',gst);
                //
                if (tranID && currencycodes) {
                    var totalAmount = getConvertedTotalAmount({tranID, currencycodes, newRecord});

                    var poTotal = getPOtotal({currencycodes, newRecord});

                    var totalForeign = parseFloat(totalAmount.foreignTotalPayment) - poTotal.totalforeignPO; // + gst.totalGSTForeign
                    var totalUSD = parseFloat(totalAmount.usdAmount) - poTotal.totalUSDPO; // + gst.totalGSTUSD


                    newRecord.setValue({fieldId: 'custbody3', value: totalUSD.toFixed(2)});

                    log.audit({
                        title: "Remaining usage units: After converting Amounts",
                        details: scriptObj.getRemainingUsage()
                    });
                }

                if (scriptContext.type == scriptContext.UserEventType.CREATE) {
                    purchaseorder.setLineActivityCodes(newRecord, scriptContext.type)
                }

                //purchaseorder.updatePOExpiryDate(newRecord);
                /*var form = scriptContext.form;
                var urlLink = getURL('customscript_sr_sl_print_purchaseorder', 'customdeploy_sr_sl_print_purchaseorder');
                urlLink += '&custscript_param_transaction_id=' + newRecord.id;
                var stOnCall = "window.open('" + urlLink + "')";
                form.addButton({
                        id: 'custpage_print',
                        label: "Print",
                        functionName: stOnCall
                });*/

                log.audit({
                    title: "Remaining usage units: End",
                    details: scriptObj.getRemainingUsage()
                });

            } catch (err) {
                log.error('beforeLoad error:', err)
            }
        }


        function getPOtotal({currencycodes, newRecord}) {
            var currencycode = getCurrencySymbol({currencycodes, currencycode: newRecord.getText('currency') || 'USD'})
            var rate = currency.exchangeRate({
                source: currencycode,
                target: 'USD',
                date: newRecord.getValue('trandate')
            });
            log.debug('getPOtotal total', newRecord.getValue('total'))
            log.debug('getPOtotal rate', rate + ' - ' + newRecord.getValue('trandate'))
            return {
                totalUSDPO: parseFloat(newRecord.getValue('total')) * rate,
                totalforeignPO: parseFloat(newRecord.getValue('total'))
            }
        }

        function getCurrencies() {
            var currencySearch = search.create({
                type: 'currency',
                filters: [],
                columns: ['name', 'symbol']
            });
            var currencycodes = []
            currencySearch.run().each((o, i) => {
                currencycodes.push({
                    name: o.getValue('name'),
                    symbol: o.getValue('symbol')
                })
                return true;
            })
            return currencycodes
        }

        function getCurrencySymbol({currencycodes, currencycode}) {
            for (var i = 0; i < currencycodes.length; i++) {
                if (currencycodes[i].name == currencycode)
                    return currencycodes[i].symbol;
            }
        }

        function getConvertedTotalAmount({tranID, currencycodes}) {
            var sSql = `SELECT 
										trandate,
										foreigntotal,
										BUILTIN.DF(currency) as currency
									FROM Transaction
									WHERE ID IN (
										SELECT TransactionLine.Transaction 
										FROM TransactionLine 
										WHERE ( TransactionLine.CreatedFrom = ${tranID.toString()})
									)`;
            log.debug('sql', sSql)
            var arrvb = query.runSuiteQL({
                query: sSql,
            }).asMappedResults();
            var currencycode = 'USD';
            var usdAmount = 0;
            var foreignTotalPayment = 0;
            log.debug('arrvb', arrvb)
            for (var vbElement in arrvb) {
                log.debug('vbElement', arrvb[vbElement])
                currencycode = getCurrencySymbol({currencycodes, currencycode: arrvb[vbElement].currency});
                var rate = currency.exchangeRate({
                    source: currencycode,
                    target: 'USD',
                    date: new Date(arrvb[vbElement].trandate)
                });
                log.debug('rate', rate)
                foreignTotalPayment += parseFloat(Math.abs(arrvb[vbElement].foreigntotal));
                usdAmount += parseFloat(Math.abs(arrvb[vbElement].foreigntotal)) * rate;
            }
            return {
                usdAmount: usdAmount,
                foreignTotalPayment: foreignTotalPayment,
                currencycode: currencycode
            }
        }


        function getURL(stScript, stDeployment) {
            var urlLink = url.resolveScript({
                scriptId: stScript,
                deploymentId: stDeployment,
                returnExternalUrl: false
            });

            return urlLink;
        }

        const afterSubmit = (scriptContext) => {
            try {
                var newRecord = scriptContext.newRecord;
                log.debug('Start', 'newRecord.type: ' + newRecord.type + ' & newRecord.id: ' + newRecord.id)
                purchaseorder.createPOfromPR(newRecord);
                if (scriptContext.type == scriptContext.UserEventType.EDIT) {
                    newRecord =  record.load({type:record.Type.PURCHASE_ORDER,id:newRecord.id})
                    purchaseorder.setLineActivityCodes(newRecord, scriptContext.type)
                }
            }catch (err) {
                log.error('afterSubmit Error:',err)
            }
        }

        return {
            beforeLoad,
            afterSubmit
        }

    });