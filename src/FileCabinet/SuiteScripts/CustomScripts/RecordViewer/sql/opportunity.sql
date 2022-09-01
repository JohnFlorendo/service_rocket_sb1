SELECT opportunity.tranid || '+/app/site/hosting/scriptlet.nl?script=1504&deploy=1&page=opportunity&idrec=' || opportunity.id AS opportunity_link
	, opportunity.title AS opportunity_name
	, BUILTIN.DF(opportunity.entity) AS customer
	, BUILTIN.DF(opportunity.employee) AS sales_rep
	, BUILTIN.DF(opportunityline.class) AS class
	, opportunity.trandate AS transaction_date
	, opportunity.expectedclosedate AS expected_close_date
	, BUILTIN.DF(opportunity.entitystatus) AS status
	, opportunity.type AS type_hide
	, opportunity.id AS id_hide
FROM transaction opportunity
INNER JOIN transactionline opportunityline
	ON opportunity.id = opportunityline.transaction
		AND opportunityline.mainline = 'T'
WHERE opportunity.type = 'Opprtnty'
	AND opportunity.id > ?
ORDER BY opportunity.id DESC