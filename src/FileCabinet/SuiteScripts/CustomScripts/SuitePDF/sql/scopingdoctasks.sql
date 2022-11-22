SELECT  projecttask.id AS id
	, projecttask.eventid AS taskid
	, projecttask.issummarytask AS isparent
	, projecttask.parent AS parent
	, projecttask.title AS name
	, BUILTIN.DF(projecttask.owner) AS owner
	, projecttask.custevent_scopingtaskdescription AS description
	, TO_CHAR(projecttask.startdatetime, 'YYYY') AS startyear
	, TO_CHAR(projecttask.startdatetime, 'MM') AS startmonth
	, TO_CHAR(projecttask.startdatetime, 'DD') AS startdate
	, TO_CHAR(projecttask.enddate , 'YYYY') AS endyear
	, TO_CHAR(projecttask.enddate , 'MM') AS endmonth
	, TO_CHAR(projecttask.enddate , 'DD') AS endday
	, (projecttask.plannedwork) / 8 AS totalwork
FROM  projecttask
WHERE projecttask.project = paramid
ORDER BY projecttask.eventid
