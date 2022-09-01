/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/query', 'N/file', 'N/ui/serverWidget', '../api/list', '../../Library/handlebars', '../../Library/handlebars/handlebarshelper'],
    /**
     * @param {file} file
     * @param {serverWidget} serverWidget
     */
    function (record, runtime, query, file, serverWidget, list, handlebars, handlebarshelper) {

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
            var idMe = runtime.getCurrentUser().id;
            var sAction = paramReq.action;
            var sList = paramReq.list;

            var sTemplate = file.load({
                id: 'SuiteScripts/CustomScripts/RecordViewer/template/recordlist_v1_0.html'
            }).getContents();

            if (sAction == 'backend') {

                var arrData;

                if (sList == 'opportunity') {
                    arrData = list.getOpportunityList({});
                } else if (sList == 'estimate') {
                    arrData = list.getEstimateList({});
                } else if (sList == 'peopletimeoffbalancce') {
                    arrData = list.getPeopleTimeoffBalance({});
                } else if (sList == 'visa') {
                    arrData = list.getVisaList({});
                }else if (sList == 'stateofregistration') {
                    log.audit('paramReq', paramReq.rectype);
                    arrData = list.getStateOfRegistrationList({});
                }

                context.response.setHeader({
                    name: 'Content-Type',
                    value: 'application/json'
                });

                context.response.write(JSON.stringify(arrData));
            } else {

                var objForm = serverWidget.createForm({
                    title: 'RecordViewer 1.0 (' + sList.toLowerCase().split(' ').map(function (word) {
                        return (word.charAt(0).toUpperCase() + word.slice(1));
                    }).join(' ') + ')'
                });

                var fldHtml = objForm.addField({
                    id: 'custpage_htmlfield',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'HTML'
                });

                var sHandlebar = handlebars.compile(sTemplate);
                handlebars = handlebarshelper.register(handlebars);

                var sHtmlTemplate = sHandlebar({
                    list: sList
                });

                fldHtml.defaultValue = sHtmlTemplate;

                context.response.writePage(objForm);
                //context.response.write(sHtmlTemplate);
            }
        }

        return {
            onRequest: onRequest
        };

    });

