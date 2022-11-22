define(['N/https', 'N/record', '../../../Helper/nsmapjson', '../../../Library/momentjs/moment'],
	/**
	 * @param {https} https
	 * @param {record} record
	 */
	function (https, record, nsmapjson, moment) {

		getPayload = function (option) {

				var rec = option.record;
				var idMap = 115;

				if (option.action == 'update') {
					idMap = 116;
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

					var objPayload = this.getPayload(option);

					var resp = https.post({
						url: "https://api.hubapi.com/crm/v3/objects/deals?hapikey={custsecret_hubspot_apikey}",
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
							lastupdate: new Date(objBody.properties.hs_lastmodifieddate).getTime().toString(),
							message: 'Hubpsot Deal Created ' + (new Date()).toString()
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

		associate = function (option) {

				var retMe = option;

				try {

					var resp = https.put({
						url: "https://api.hubapi.com/crm/v3/objects/deals/"
							+ option.id + "/associations/" + option.type + "/"
							+ option.to + "/5?hapikey={custsecret_hubspot_apikey}",
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
							lastupdate: objBody.properties.hs_lastmodifieddate,
							message: 'Hubspot Deal Associated ' + (new Date()).toString()
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
					status: '',
					request: option
				};
				
				option.action = 'update';

				try {

					//Hubspot Batch Update Payload {inputs: [{deals}]}
					var objPayload = { inputs: [this.getPayload(option)] };
					
					var resp = https.post({
						url: "https://api.hubapi.com/crm/v3/objects/deals/batch/update?hapikey={custsecret_hubspot_apikey}",
						body: JSON.stringify(objPayload),
						headers: {
							'Content-Type': 'application/json',
							'Accept': '*/*'
						},
						credentials: ['custsecret_hubspot_apikey']
					});

					if (resp.code == 200 || resp.code == 201) {

						var dDate = new Date();

						var objBody = JSON.parse(resp.body).results[0];

						retMe.status = 'SUCCESS';
						
						retMe.response = {
							id: objBody.id,
							lastupdate: new Date(objBody.properties.hs_lastmodifieddate).getTime().toString(),
							message: 'Hubpsot Deal Updated ' + (new Date()).toString()
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
						message: 'ERROR: ' + err
					};
				}

				return retMe;
			};

		get = function(option){
			
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
					url: "https://api.hubapi.com/crm/v3/objects/deals/"
						+ option.id + "?associations=company&archived=false&hapikey={custsecret_hubspot_apikey}" + sProperties,
					headers: {
						'Content-Type' : 'application/json',
						'Accept': '*/*'
					},
					credentials: ['custsecret_hubspot_apikey']
				});

				if (resp.code == 200 || resp.code == 201) {

					var dDate = new Date();
					var objBody = JSON.parse(resp.body);

					retMe.status = 'SUCCESS';
					
					retMe.result = {
						status: 'SUCCESS',
						data: objBody,
					};
					
					retMe.response = {
						data: objBody,
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
					message: err
				};
			}

			return retMe;
		};
			
		getAssociatedCompanyt = function(option){
			
		};
		
		search = function (option) {

			var retMe = option;
			var objPayload = option.request;
			var arrDeals = [];

			try {
				
				var sNext = 'firstrun';

				while (sNext != '') {

					var resp = https.post({
						url: "https://api.hubapi.com/crm/v3/objects/deals/search?hapikey={custsecret_hubspot_apikey}",
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
						arrDeals = arrDeals.concat(objBody.results);;

						if (objBody.paging != undefined) {
							if (objBody.paging.next.after) {
								sNext = objBody.paging.next.after;
								objPayload.after = objBody.paging.next.after;
							}
							else {
								sNext = '';
							}
						}
						else {
							sNext = '';
						}

						retMe.result = {
							status: 'SUCCESS',
							data: arrDeals
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

						retMe.result = {
							status: 'FAILED',
							message: resp.code + ': ' + objBody.message
						};
					}
				}
			}

			catch (err) {

				retMe.result = {
					status: 'FAILED',
					message: err
				};
			}

			log.audit({
				title: 'search',
				details: 'retMe: ' + JSON.stringify(retMe)
			});

			return retMe;
		};


		return {
			create: create,
			associate: associate,
			get: get,
			update: update,
			search: search,
			getPayload: getPayload
		};

	});
