SELECT opportunity.tranid AS opportunity_number
	, opportunity.title AS title
	, BUILTIN.DF(opportunity.entity) AS customer
	, BUILTIN.DF(opportunityline.subsidiary) AS subsidiary
	, BUILTIN.DF(opportunityline.class) AS class
	, opportunity.trandate AS date
	, opportunity.expectedclosedate AS expected_closed_date
	, BUILTIN.DF(opportunity.entitystatus) AS status
	, opportunity.probability * 100 AS probability
	, opportunity.projectedtotal AS amount
FROM transaction opportunity
INNER JOIN transactionline opportunityline
	ON opportunity.id = opportunityline.transaction
		AND opportunityline.mainline = 'T'
WHERE opportunity.type = 'Opprtnty'
	AND opportunity.id = ?
ORDER BY opportunity.id DESC
