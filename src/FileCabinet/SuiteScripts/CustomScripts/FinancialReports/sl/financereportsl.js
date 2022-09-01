/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/query', 'N/file', 'N/ui/serverWidget', '../../MyServiceRocket/api/myservicerocket', '../api/report', '../../Library/handlebars', '../../Library/handlebars/handlebarshelper'],
	/**
	 * @param {file} file
	 * @param {serverWidget} serverWidget
	 */
	function (record, runtime, query, file, serverWidget, myservicerocket, report, handlebars, handlebarshelper) {

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
			var sReport = paramReq.report;
			var sType = paramReq.type;
			var sTemplate; 
			var objHandlebar = {};
			var arrParams = [];
			var arrApps = [];

			if (sAction == 'backend') {
				
				var arrData;
				
				if(sReport == 'servicerocketpandl'){
					
					var hasPermission = myservicerocket.hasMyAppsPermission({
						custparam: {
							paramuser: idMe,
							paramapps: sReport + sType
						}
					});
					
					if(!hasPermission){
						return;
					}
					
					if(sType == 'all'){
						arrData = report.getPandL({});		
					}
					else{
						arrData = report.getPandL({
							'type' :  sType
						});
					}
				}

	    		context.response.setHeader({
	          		name: 'Content-Type',
	          		value: 'application/json'
	        	});
				
				context.response.write(JSON.stringify(arrData));
			}
			else {

				var objForm;
				
				
				if (sReport == undefined){
					
					var hasPermission = myservicerocket.hasMySrPermission({
						custparam: {
							paramuser: idMe,
							parammyservicerocket: 'financialreports'
						}
					});
					
					if(!hasPermission){
						return;
					}
					
					arrApps = myservicerocket.getMyApps({
						custparam: {
							paramuser: idMe,
							parampage: 'financialreports'
						}
					});
					
					objForm = serverWidget.createForm({
						title: 'Financial Reports'
					});
					
					sTemplate = file.load({
						id: 'SuiteScripts/CustomScripts/FinancialReports/template/financereports_v1_1.html'
					}).getContents(); 
					
					objHandlebar = {
						report: sReport,
						apps: arrApps
					}
					
				}
				else if(sReport == 'servicerocketpandl'){
					
					
					var objLob = {
							'ps': 'Professional Service',
							'ms': 'Managed Service',
							'apps': 'Apps',
							'resell': 'Resell',
							'learndot': 'Learndot',
						};
					
					var hasPermission = myservicerocket.hasMyAppsPermission({
						custparam: {
							paramuser: idMe,
							paramapps: sReport + sType
						}
					});
					
					if(!hasPermission){
						return;
					}
					
					objForm = serverWidget.createForm({
						title: 'P & L (' + objLob[sType]+')'
					});
					
					sTemplate = file.load({
						id: 'SuiteScripts/CustomScripts/FinancialReports/template/pandl.html'
					}).getContents(); 
					
					objHandlebar = {
						report: sReport,
						type: sType,
						lob: objLob[sType]
					}
				}
				


				var fldHtml = objForm.addField({
					id: 'custpage_htmlfield',
					type: serverWidget.FieldType.INLINEHTML,
					label: 'HTML'
				});
				
				var sHandlebar = handlebars.compile(sTemplate);
				handlebars = handlebarshelper.register(handlebars);

				var sHtmlTemplate = sHandlebar(objHandlebar);

				fldHtml.defaultValue = sHtmlTemplate;

				context.response.writePage(objForm);
			}
		}

		return {
			onRequest: onRequest
		};

	});

