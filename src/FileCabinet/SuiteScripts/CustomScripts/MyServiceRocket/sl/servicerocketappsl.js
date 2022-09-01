/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/file', 'N/runtime', 'N/ui/serverWidget', '../../MyServiceRocket/api/myservicerocket', '../../Library/handlebars/handlebars', '../../Library/handlebars/handlebarshelper'],
	/**
	 * @param {serverWidget} serverWidget
	 */
	function(file, runtime, serverWidget, myservicerocket, handlebars, handlebarshelper) {

		/**
		 * Definition of the Suitelet script trigger point.
		 *
		 * @param {Object} context
		 * @param {ServerRequest} context.request - Encapsulation of the incoming request
		 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
		 * @Since 2015.2
		 */
		onRequest = function (context) {
			try{
				var idMe = runtime.getCurrentUser().id;
				var paramReq = context.request.parameters;
				var sMyServiceRocket = paramReq.myservicerocket



				log.audit({
					title: 'MyServiceRocket',
					details: 'user: ' + idMe + '| myservicerocket: ' + sMyServiceRocket
				});


				if(sMyServiceRocket == 'people' || sMyServiceRocket == 'customreports' || sMyServiceRocket == 'recordviewer' || sMyServiceRocket == 'myrecords'){

					var sTableHTML = file.load({
						id: '../template/myservicerocket_v2_0.html'
					}).getContents();

					objForm = serverWidget.createForm({
						title: 'MyServiceRocket'
					});

					var hasPermission = myservicerocket.hasMySrPermission({
						custparam: {
							paramuser: idMe,
							parammyservicerocket: sMyServiceRocket
						}
					});

					if(!hasPermission){

						var fldHtml = objForm.addField({
							id: 'custpage_htmlfield',
							type: serverWidget.FieldType.INLINEHTML,
							label: 'HTML'
						});


						fldHtml.defaultValue = 'MyServiceRocket: Forbidden Accesss. Please inform you manager if you neeed access to this page.';

						context.response.writePage(objForm);

						return;
					}

					objForm = serverWidget.createForm({
						title: 'MyRecords'
					});

					arrApps = myservicerocket.getMyApps({
						custparam: {
							paramuser: idMe,
							parampage: sMyServiceRocket
						}
					});
					log.audit('arrApps',arrApps)
					var sHandlebar = handlebars.compile(sTableHTML);
					handlebars = handlebarshelper.register(handlebars);
					var sFinishedHtml = sHandlebar({
						apps: arrApps,
						name: ''
					});

					var fldHtml = objForm.addField({
						id: 'custpage_sfield',
						type: serverWidget.FieldType.INLINEHTML,
						label: 'HTML'
					});

					fldHtml.defaultValue = sFinishedHtml;

					context.response.writePage(objForm);

				}
				else{

					var sTableHTML = file.load({
						id: '../template/myservicerocket_v3_0.html'
					}).getContents();

					objForm = serverWidget.createForm({
						title: 'MyServiceRocket'
					});

					/*var hasPermission = myservicerocket.hasMySrPermission({
						custparam: {
							paramuser: idMe,
							parammyservicerocket: sMyServiceRocket
						}
					});

					if(!hasPermission){

						var fldHtml = objForm.addField({
							id: 'custpage_htmlfield',
							type: serverWidget.FieldType.INLINEHTML,
							label: 'HTML'
						});


						fldHtml.defaultValue = 'MyServiceRocket: Forbidden Accesss. Please inform you manager if you neeed access to this page.';

						context.response.writePage(objForm);

						return;
					}*/

					objForm = serverWidget.createForm({
						title: 'MyServiceRocket'
					});

					arrApps = myservicerocket.getMyAppsByGroup({
						custparam: {
							paramuser: idMe,
							parampage: sMyServiceRocket
						}
					});
					log.audit('arrApps',arrApps)
					var sHandlebar = handlebars.compile(sTableHTML);
					handlebars = handlebarshelper.register(handlebars);
					var sFinishedHtml = sHandlebar({

						groupings: arrApps,
						name: ''
					});

					var fldHtml = objForm.addField({
						id: 'custpage_sfield',
						type: serverWidget.FieldType.INLINEHTML,
						label: 'HTML'
					});

					fldHtml.defaultValue = sFinishedHtml;

					context.response.writePage(objForm);
				}
			}catch (err) {
				log.error('onRequest Error:',err)
			}

		};

		return {
			onRequest: onRequest
		};

	});

