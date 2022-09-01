/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/query', 'N/file', 'N/ui/serverWidget', '../api/record', '../api/list','../../Library/handlebars', '../../Library/handlebars/handlebarshelper'],
	/**
	 * @param {file} file
	 * @param {serverWidget} serverWidget
	 */
	function (record, runtime, query, file, serverWidget, recordvw, listvw, handlebars, handlebarshelper) {

		/**
		 * Definition of the Suitelet script trigger point.
		 *
		 * @param {Object} context
		 * @param {ServerRequest} context.request - Encapsulation of the incoming request
		 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
		 * @Since 2015.2
		 */

		function onRequest(context) {
			try {
				var paramReq = context.request.parameters;
				var idMe = runtime.getCurrentUser().id;
				var sAction = paramReq.action;
				var idRecord = paramReq.idrec;
				var sPage = paramReq.page;
				var sList = paramReq.list;

				var sTemplate = file.load({
					id: 'SuiteScripts/CustomScripts/RecordViewer/template/recordpage_v1_0.html'
				}).getContents();


				if (sAction == 'backend') {
					log.audit(backend,sPage)
					var arrData;

					if (sPage == 'opportunity') {

						arrData = recordvw.getOpportunity({
							id: idRecord
						});
					} else if (sList == 'opportunityitems') {
						arrData = listvw.getOpportunityItems({
							params: [idRecord]
						});
					} else if (sList == 'opportunityrelatedrecords') {
						arrData = listvw.getOpportunityRelatedRecords({
							params: [idRecord],
							custparam: {
								paramid: idRecord
							}
						});
					} else if (sList == 'estimateitems') {
						arrData = listvw.getEstimateItems({
							params: [idRecord]
						});
					} else if (sList == 'estimaterelatedrecords') {
						arrData = listvw.getEstimateRelatedRecords({
							params: [idRecord]
						});
					} else if (sPage == 'visa') {

						arrData = recordvw.getVisa({
							id: idRecord
						});
					}else if (sPage == 'stateofregistration') {

						arrData = recordvw.getStateOfRegistration({
							id: idRecord
						});
					}

					context.response.setHeader({
						name: 'Content-Type',
						value: 'application/json'
					});

					context.response.write(JSON.stringify(arrData));
				} else {

					var objForm = serverWidget.createForm({
						title: 'RecordViewer 1.0 (' + sPage.toLowerCase().split(' ').map(function (word) {
							return (word.charAt(0).toUpperCase() + word.slice(1));
						}).join(' ') + ')'
					});


					var fldHtml = objForm.addField({
						id: 'custpage_htmlfield',
						type: serverWidget.FieldType.INLINEHTML,
						label: 'HTML'
					});

					var objRec = {};

					if (sPage == 'opportunity') {
						objRec = recordvw.getOpportunity({
							id: idRecord
						});
					} else if (sPage == 'estimate') {
						objRec = recordvw.getEstimate({
							id: idRecord
						});
					}
					else if (sPage == 'visa') {
						objRec = recordvw.getVisa({
							id: idRecord
						});
					}else if (sPage == 'stateofregistration') {
						objRec = recordvw.getStateOfRegistration({
							id: idRecord
						});
					}

					objRec.page = sPage;
					objRec.idrec = idRecord;

					var sHandlebar = handlebars.compile(sTemplate);
					handlebars = handlebarshelper.register(handlebars);

					var sHtmlTemplate = sHandlebar(objRec);

					fldHtml.defaultValue = sHtmlTemplate;

					context.response.writePage(objForm);
				}
			}catch (err) {
				log.error('ERROR ',err)
			}
		}

		return {
			onRequest: onRequest
		};

	});

