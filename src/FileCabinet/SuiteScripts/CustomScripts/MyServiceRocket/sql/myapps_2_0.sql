SELECT myapps.name as name
	,myapps.custrecord_mya_myappsid as myappsid
	,BUILTIN.DF(myapps.custrecord_mya_appsgroup) as groupname
	,myapps.custrecord_mya_url as url
FROM customrecord_myapps myapps
LEFT JOIN map_customrecord_myapps_custrecord_mya_audience audience
	ON myapps.id = audience.mapone
LEFT JOIN customrecord_myservrocket as myservicerocket
	ON myapps.custrecord_mya_myservicerocket = myservicerocket.id
WHERE
myservicerocket.id = 2 AND (audience.maptwo = paramuser OR myapps.custrecord_mya_availabletoall='T')
ORDER BY myapps.id,myapps.custrecord_mya_order