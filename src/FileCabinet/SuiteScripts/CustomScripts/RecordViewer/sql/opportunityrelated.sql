SELECT CASE WHEN type = 'Estimate' 
		THEN
		tranid || '+/app/site/hosting/scriptlet.nl?script=1504&deploy=1&page=estimate&idrec=' || id 
		ELSE
		tranid || '+/app/site/hosting/scriptlet.nl?script=1504&deploy=1&page=opportunity&idrec=paramid' 
		END AS transaction_number_link
	, trandate AS date
	, foreigntotal AS amount_numeric
	, type AS type
FROM transaction
WHERE  opportunity = ?