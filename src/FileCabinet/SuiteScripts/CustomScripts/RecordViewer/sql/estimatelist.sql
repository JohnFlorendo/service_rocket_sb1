SELECT estimate.tranid || '+/app/site/hosting/scriptlet.nl?script=1504&deploy=1&page=estimate&idrec=' || estimate.id AS estimate_link
	, estimate.title AS estimate_name
	, BUILTIN.DF(estimate.entity) AS customer
	, BUILTIN.DF(estimate.employee) AS sales_rep
	, BUILTIN.DF(estimateline.class) AS class
	, estimate.trandate AS transaction_date
	, estimate.duedate AS due_date
	, BUILTIN.DF(estimate.entitystatus) AS status
	, BUILTIN.DF(estimate.custbody_sr_estimate_approval_status) AS quote_status
	, BUILTIN.DF(estimate.custbody_quote_type) AS quote_type
	, estimate.type AS type_hide
	, estimate.id AS id_hide
FROM transaction estimate
INNER JOIN transactionline estimateline
	ON estimate.id = estimateline.transaction
		AND estimateline.mainline = 'T'
WHERE estimate.type = 'Estimate'
	AND estimate.id > ?
ORDER BY estimate.id DESC