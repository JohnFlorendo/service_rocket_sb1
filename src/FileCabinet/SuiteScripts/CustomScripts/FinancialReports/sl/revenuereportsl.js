/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/query', 'N/file', 'N/ui/serverWidget', '../api/revenue', '../../Library/handlebars', '../../Library/handlebars/handlebarshelper'],
	/**
	 * @param {file} file
	 * @param {serverWidget} serverWidget
	 */
	function (record, runtime, query, file, serverWidget, revenue, handlebars, handlebarshelper) {

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
			var sCurrency = paramReq.currencyrate;
			var sTemplate = file.load({
				id: 'SuiteScripts/CustomScripts/FinancialReports/template/projectrevenue.html'
			}).getContents(); 
			
			var arrParams = [];
			
			if (sAction == 'backend') {

				arrData = revenue.getProject({
					currencyrate: sCurrency
				});
				
	    		context.response.setHeader({
	          		name: 'Content-Type',
	          		value: 'application/json'
	        	});
				
				context.response.write(JSON.stringify(arrData));
			}
			else {

				var objForm = serverWidget.createForm({
					title: 'Project Revenue'
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

				context.response.writePage(objForm);
			}
		}

		return {
			onRequest: onRequest
		};

	});

