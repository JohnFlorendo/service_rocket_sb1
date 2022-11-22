define(['N/file', 'N/query'
	, '../../../Library/handlebars'
	, '../../../Library/handlebars/handlebarshelper'
],

	function (file, query, handlebars, handlebarshelper) {

		function generateGanttChart(option) {

			var sTemplate = sTemplate = file.load({
				id: '../../template/scopingdocgantt.html'
			});

			var objScopingDoc = {};

			var sSql = file.load({
				id: '../../sql/scopingdocproject.sql'
			}).getContents();

			var custParam = {
				paramid: option.id,
			};

			var regx = new RegExp(Object.keys(custParam).join("|"), "gi");
			sSql = sSql.replace(regx, function (matched) {
				return custParam[matched];
			});

			var arrProject = query.runSuiteQL({
				query: sSql
			}).asMappedResults();

			if (arrProject.length > 0) {
				objScopingDoc = arrProject[0];
			}
			else {
				return null;
			}

			var sSql = file.load({
				id: '../../sql/scopingdoctasks.sql'
			}).getContents();

			var custParam = {
				paramid: option.id,
			};

			var regx = new RegExp(Object.keys(custParam).join("|"), "gi");
			sSql = sSql.replace(regx, function (matched) {
				return custParam[matched];
			});

			var arrTask = query.runSuiteQL({
				query: sSql
			}).asMappedResults();

			var objScopingTask = {};

			arrTask.forEach(function (task) {

				if (task.isparent == 'T' && task.parent == null) {

					if (!objScopingTask.hasOwnProperty(task.id)) {

						objScopingTask[task.id] = {
							id: task.id,
							name: task.name,
							description: task.description,
							totalwork: task.totalwork,
							tasks: []
						}
					}
				}
				else {
					objScopingTask[task.parent].tasks.push(task);
				}
			});

			objScopingDoc.tasks = objScopingTask;

			var sHandlebar = handlebars.compile(sTemplate.getContents());
			handlebars = handlebarshelper.register(handlebars);

			var sPdfTemplate = sHandlebar(objScopingDoc);

			var regx = new RegExp(Object.keys(custParam).join("|"), "gi");
			sPdfTemplate = sPdfTemplate.replace(regx, function (matched) {
				return custParam[matched];
			});

			return {
				name: 'scopingdoc',
				content: sPdfTemplate
			};
		}

		function generatePDF(option) {

			var sTemplate = sTemplate = file.load({
				id: '../../template/scopingdoc.html'
			});

			var objScopingDoc = {};

			var sSql = file.load({
				id: '../../sql/scopingdocproject.sql'
			}).getContents();

			var custParam = {
				paramid: option.id,
			};

			var regx = new RegExp(Object.keys(custParam).join("|"), "gi");
			sSql = sSql.replace(regx, function (matched) {
				return custParam[matched];
			});

			var arrProject = query.runSuiteQL({
				query: sSql
			}).asMappedResults();

			if (arrProject.length > 0) {
				objScopingDoc = arrProject[0];
			}
			else {
				return null;
			}

			var sSql = file.load({
				id: '../../sql/scopingdoctasks.sql'
			}).getContents();

			var custParam = {
				paramid: option.id,
			};

			var regx = new RegExp(Object.keys(custParam).join("|"), "gi");
			sSql = sSql.replace(regx, function (matched) {
				return custParam[matched];
			});

			var arrTask = query.runSuiteQL({
				query: sSql
			}).asMappedResults();

			var objScopingTask = {};

			arrTask.forEach(function (task) {

				if (task.isparent == 'T' && task.parent == null) {

					if (!objScopingTask.hasOwnProperty(task.id)) {

						objScopingTask[task.id] = {
							name: task.name,
							description: task.description,
							totalwork: task.totalwork,
							tasks: []
						}
					}

				}
				else {
					objScopingTask[task.parent].tasks.push(task);
				}

			});

			objScopingDoc.tasks = objScopingTask;

			var sHandlebar = handlebars.compile(sTemplate.getContents());
			handlebars = handlebarshelper.register(handlebars);

			var sPdfTemplate = sHandlebar(objScopingDoc);

			var custParam = {
				'<br>': '<br/>',
				'<h1>': '<div><h1>',
				'</h1>': '</h1></div>',
				'<h2>': '<div><h2>',
				'</h2>': '</h2></div>',
				'<h3>': '<div><h3>',
				'</h3>': '</h3></div>',
				'<h4>': '<div><h4>',
				'</h4>': '</h4></div>'
			};

			var regx = new RegExp(Object.keys(custParam).join("|"), "gi");
			sPdfTemplate = sPdfTemplate.replace(regx, function (matched) {
				return custParam[matched];
			});

			return {
				name: objScopingDoc.projectid,
				content: sPdfTemplate
			};
		}

		return {
			generatePDF: generatePDF,
			generateGanttChart: generateGanttChart
		};

	});
