define(['N/https'],

function(https) {
   
	createHW = function(option){
		
		var retMe = {
				request : option
			};
			
			var resp = https.post({
				url: 'https://api.box.com/2.0/folders',
				body: JSON.stringify({
					       name: option.folder.name,
					       parent: {
					    	   id: option.folder.parent
					       }					       
					}
				),
				headers: {
					'Content-Type': 'application/json', 
					'Authorization' : "Bearer {custsecret_box_apikey}"
				},
				credentials : [ 'custsecret_box_apikey' ]
				
			});
			
			if (resp.code == 200 || resp.code == 201) {

				var objBody = JSON.parse(resp.body);

				retMe.status = 'SUCCESS';
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
				retMe.response = {
					message: resp.code + ': ' + objBody.message
				};
			}
			

			return retMe;
	};
	
	contents = function(option){
		
		var retMe = {
			request : option
		};
		
		var resp = https.get({
			url: 'https://api.box.com/2.0/folders/' + option.folder.id +'/items', 
			headers: {
				'Content-Type': 'application/json', 
				'Authorization' : "Bearer {custsecret_box_apikey}"
			},
			credentials : [ 'custsecret_box_apikey' ]
			
		});
		
		if (resp.code == 200 || resp.code == 201) {

			var objBody = JSON.parse(resp.body);

			retMe.status = 'SUCCESS';
			retMe.response = {
				data: objBody.entries,
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

		return retMe;
		
	};
	
	update = function(option){

		var retMe = {
			request : option
		};
		
		var resp = https.put({
			url: 'https://api.box.com/2.0/folders/' + option.data.id, 
			body: JSON.stringify(option.data), 
			headers: {
				'Content-Type': 'application/json', 
				'Authorization' : "Bearer {custsecret_box_apikey}"
			},
			credentials : [ 'custsecret_box_apikey' ]
			
		});
		
		if (resp.code == 200 || resp.code == 201) {

			var objBody = JSON.parse(resp.body);

			retMe.status = 'SUCCESS';
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
			retMe.response = {
				message: resp.code + ': ' + objBody.message
			};
		}

		return retMe;

	};
	
	items = function(option){
		
		var retMe = {
			status : '',
			request : option
		};
			
		var resp = https.get({
			url: 'https://api.box.com/2.0/folders/'+ option.data.folder+'/items', 
			headers: {
				'Content-Type': 'application/json', 
				'Authorization' : "Bearer {custsecret_box_apikey}"
			},
			credentials : [ 'custsecret_box_apikey' ]
			
		});
			
		if (resp.code == 200 || resp.code == 201) {

			var objBody = JSON.parse(resp.body);

			retMe.status = 'SUCCESS';
			retMe.response = {
				data: objBody.entries
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
		
		return retMe;
	};
	
	
    return {
    	createHW: createHW,
        update: update,
        items: items,
        contents: contents
    };
    
});
