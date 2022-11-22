define(['N/https', 'N/record', 'N/runtime', '../../../Helper/nsmapjson', '../../../Library/momentjs/moment'],
	/**
	 * @param {https} https
	 * @param {record} record
	 * @param {runtime} runtime
	 */
	function (https, record, runtime, nsmapjson, moment) {

		getPayload = function (option) {

			var rec = option.record;
			var idMap = 118;

			if (option.action == 'update') {
				idMap = 119;
			}

			var recMapping = record.load({
				type: 'customrecord_integration_mapping',
				id: idMap
			});

			var objMap = JSON.parse(recMapping.getValue({
				fieldId: 'custrecord_intmap_mapping'
			}));

			var objPayload = nsmapjson.generate({
				mapping: objMap,
				record: rec
			});

			return objPayload;
		};

		create = function (option) {
			
			var retMe = {
				status: '',
				request: option
			};
			
			option.action = 'create';

			try {

				var objPayload = getPayload(option);

				var resp = https.post({
					url: "https://api.hubapi.com/crm/v3/objects/companies?hapikey={custsecret_hubspot_apikey}",
					body: JSON.stringify(objPayload),
					headers: {
						'Content-Type': 'application/json',
						'Accept': '*/*'
					},
					credentials: ['custsecret_hubspot_apikey']
				});

				if (resp.code == 200 || resp.code == 201) {

					var dDate = new Date();
					var objBody = JSON.parse(resp.body);

					retMe.status = 'SUCCESS';
					
					retMe.response = {
						id: objBody.id,
						message: 'Hubpsot Company Created ' + (new Date()).toString()
					};
				}
				else {

					var objBody = {};

					try {
						objBody = JSON.parse(resp.body);
					}
					catch (err) {

						var e = err;
						objBody.message = resp.body;
					}

					retMe.status = 'FAILED';
					retMe.response = {
						message: resp.code + ': ' + objBody.message
					};
				}
			}

			catch (err) {
				
				retMe.status = 'FAILED';
				retMe.response = {
					message : 'ERROR: ' + err
				};
			}
			
			return retMe;
		};

		update = function (option) {

			
			var retMe = {
				action: 'update',
				request: option
			};
			
			option.action = 'update';

			try {

				var objPayload = { inputs: [getPayload(option)] };

				var resp = https.post({
					url: "https://api.hubapi.com/crm/v3/objects/companies/batch/update?hapikey={custsecret_hubspot_apikey}",
					body: JSON.stringify(objPayload),
					headers: {
						'Content-Type': 'application/json',
						'Accept': '*/*'
					},
					credentials: ['custsecret_hubspot_apikey']
				});

				if (resp.code == 200 || resp.code == 201) {

					var objBody = JSON.parse(resp.body).results[0];
					
					retMe.status = 'SUCCESS';
					retMe.response = {
						data: objBody
					};
				}
				else {

					var objBody = {};

					try {
						objBody = JSON.parse(resp.body);
					}
					catch (err) {

						var e = err;
						objBody.message = resp.body;
					}

					retMe.status = 'FAILED';
					retMe.response = {
						message: resp.code + ': ' + objBody.message
					};
				}
			}

			catch (err) {

				retMe.status = 'FAILED';
				retMe.response = {
					message: resp.code + ': ' + objBody.message
				};
			}
			
			return retMe;
		};

		get = function (option) {

			var retMe = {
				request: option
			};

			try {

				var sProperties = '';
				
				if(option.properties.length > 0){
					sProperties = ((option.properties.map(function(a){
						return '&properties='+a;
					})).toString()).replace(/,/g,'');
				}
				
				
				var resp = https.get({
					url: "https://api.hubapi.com/crm/v3/objects/companies/"
						+ option.id + "?archived=false&hapikey={custsecret_hubspot_apikey}" + sProperties,
					headers: {
						'Content-Type': 'application/json',
						'Accept': '*/*'
					},
					credentials: ['custsecret_hubspot_apikey']
				});

				if (resp.code == 200 || resp.code == 201) {

					var objBody = JSON.parse(resp.body);
					
					retMe.status = 'SUCCESS';

					retMe.result = {
						status: 'SUCCESS',
						data: objBody
					};
					
					retMe.response = {
						data: objBody							
					};
					
				}
				else {

					var objBody = {};

					try {
						objBody = JSON.parse(resp.body);
					}
					catch (err) {

						var e = err;
						objBody.message = resp.body;
					}

					retMe.status = 'FAILED';
					
					retMe.result = {
						status: 'FAILED',
						message: resp.code + ': ' + objBody.message
					};
					
					retMe.response = {
						message: resp.code + ': ' + objBody.message							
					};
					
				}
			}
			catch (err) {

				retMe.status = 'FAILED';
				
				retMe.result = {
					status: 'FAILED',
					message: err
				};
				
				retMe.response = {
					message: resp.code + ': ' + objBody.message							
				};
			}

			return retMe;
		};

		search = function (option) {

			var retMe = option;
			var arrCompanies = [];

			try {

				var sNext = 'firstrun';

				while (sNext != '' && runtime.getCurrentScript().getRemainingUsage() > 100) {

					var resp = promise({
						function: function(){
							return https.post({
								url: "https://api.hubapi.com/crm/v3/objects/companies/search?hapikey={custsecret_hubspot_apikey}",
								body: JSON.stringify(option.request),
								headers: {
									'Content-Type': 'application/json',
									'Accept': '*/*'
								},
								credentials: ['custsecret_hubspot_apikey']
							});
						},
						delay: 1000
					})

					if (resp.code == 200 || resp.code == 201) {
						
						var objBody = JSON.parse(resp.body);
						arrCompanies = arrCompanies.concat(objBody.results);;

						if (objBody.paging != undefined) {

							if (objBody.paging.next.after) {
								sNext = objBody.paging.next.after;
								option.request.after = objBody.paging.next.after;
							}
							else {
								sNext = '';
							}
						}
						else {
							sNext = '';
						}

						retMe.response = {
							status: 'SUCCESS',
							data: arrCompanies
						};
					}
					else {

						var objBody = {};

						try {
							objBody = JSON.parse(resp.body);
						}
						catch (err) {

							var e = err;
							objBody.message = resp.body;
						}

						retMe.response = {
							status: 'FAILED',
							message: resp.code + ': ' + objBody.message,
							data: arrCompanies
						};
					}
				}
			}

			catch (err) {

				retMe.response = {
					status: 'FAILED',
					message: err
				};
			}

			return retMe;
		};

		promise = function (option){
			var date = new Date();
			date.setMilliseconds(date.getMilliseconds() + option.delay);
			while(new Date() < date){
			}
			
			return option.function();
		}


		return {
			create: create,
			get: get,
			update: update,
			search: search
		};

	});
