/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/runtime', 'N/file', 'N/ui/serverWidget', '../api/revenue', '../../Library/handlebars', '../../Library/handlebars/handlebarshelper'],
    /**
     * @param{record} record
     * @param{runtime} runtime
     */
    (record, runtime, file, serverWidget, revenue, handlebars, handlebarshelper) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            var paramReq = scriptContext.request.parameters;
            var idMe = runtime.getCurrentUser().id;
            var sAction = paramReq.action;
            var sCurrency = paramReq.currencyrate;
            var sTemplate = file.load({
                id: 'SuiteScripts/CustomScripts/FinancialReports/template/revcontribyproject.html'
            }).getContents();

            var arrParams = [];

            if (sAction == 'backend') {

                arrData = revenue.getRevContriByProject({
                    currencyrate: sCurrency
                });

                scriptContext.response.setHeader({
                    name: 'Content-Type',
                    value: 'application/json'
                });

                scriptContext.response.write(JSON.stringify(arrData));
            } else {

                var objForm = serverWidget.createForm({
                    title: 'Revenue Contribution by Project'
                });

                var fldHtml = objForm.addField({
                    id: 'custpage_htmlfield',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'HTML'
                });

                var sHandlebar = handlebars.compile(sTemplate);
                handlebars = handlebarshelper.register(handlebars);

                var sHtmlTemplate = sHandlebar({
                    currencyrate: sCurrency
                });

                fldHtml.defaultValue = sHtmlTemplate;

                scriptContext.response.writePage(objForm);
            }
        }

        return {onRequest}

    });
