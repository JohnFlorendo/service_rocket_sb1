SELECT myapps.name AS name
	, custrecord_mya_url AS url
	,BUILTIN.DF(custrecord_mya_country) AS country
FROM customrecord_myapps myapps
INNER JOIN customrecord_myservrocket myservrocket
	ON myapps.custrecord_mya_myservicerocket = myservrocket.id
LEFT JOIN map_customrecord_myapps_custrecord_mya_audience audience
	ON myapps.id = audience.mapone
LEFT JOIN map_customrecord_myapps_custrecord_mya_jobprofile jobprofile
	ON myapps.id = jobprofile.mapone
LEFT JOIN employee
	ON jobprofile.maptwo = employee.job
LEFT JOIN map_customrecord_myapps_custrecord_mya_group groups
	ON myapps.id = groups.mapone
LEFT JOIN entitygroup 
	ON groups.maptwo = entitygroup.id
LEFT JOIN entitygroupmember
	ON entitygroup.id = entitygroupmember.group
WHERE myapps.custrecord_mya_myappsid = 'paramapps' 
	AND (myapps.custrecord_mya_availabletoall = 'T'
	OR (audience.maptwo = paramuser
			OR employee.id = paramuser
			OR entitygroupmember.employeemember = paramuser))