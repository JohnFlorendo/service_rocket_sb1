SELECT myservicerocket.name AS name
	, myservicerocket.custrecord_msrperm_page AS page
FROM customrecord_myservrocket myservicerocket
INNER JOIN map_customrecord_myservrocket_custrecord_msrperm_audience audience
	ON myservicerocket.id = audience.mapone
WHERE myservicerocket.custrecord_msrperm_page = 'parammyservicerocket'
	AND audience.maptwo = paramuser