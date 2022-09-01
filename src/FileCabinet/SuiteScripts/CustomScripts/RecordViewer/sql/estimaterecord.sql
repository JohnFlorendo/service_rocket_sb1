SELECT estimate.tranid AS estimate_number
	, estimate.title AS title
	, BUILTIN.DF(estimate.entity) AS customer
	, BUILTIN.DF(estimateline.subsidiary) AS subsidiary
	, BUILTIN.DF(estimateline.class) AS class
	, estimate.trandate AS date
	, estimate.expectedclosedate AS expected_close_date
	, estimate.duedate AS due_date
	, BUILTIN.DF(estimate.entitystatus) AS entity_status
	, estimate.probability * 100 AS probability 
	, BUILTIN.DF(estimate.custbody_sr_estimate_approval_status) AS quote_status
	, BUILTIN.DF(estimate.custbody_quote_type) AS quote_type
	, BUILTIN.DF(estimate.opportunity) AS opportunity
	, BUILTIN.DF(estimate.employee) AS sales_rep
FROM transaction estimate
INNER JOIN transactionline estimateline
	ON estimate.id = estimateline.transaction
		AND estimateline.mainline = 'T'
WHERE estimate.type = 'Estimate'
	AND estimate.id = ?
ORDER BY estimate.id DESC