SELECT job.entityid AS projectid
	, job.companyname AS projectname
	, REPLACE(BUILTIN.DF(job.custentity_sr_scoping_quote), 'Estimate #', '') AS quote
	, BUILTIN.DF(estimate.employee) AS salesrep
	, employee.email AS salesrepemail
	, BUILTIN.DF(job.parent) AS customer
	, billingadd.addr1 AS custaddr1
	, CASE WHEN billingadd.addr2 IS NULL THEN ''
		ELSE billingadd.addr2 || '<br/>' END AS custaddr2
	, billingadd.city AS custcity
	, billingadd.state AS custstate
	, billingadd.zip AS custzip
	, BUILTIN.DF(billingadd.country) AS custcountry
	, BUILTIN.DF(estimateline.subsidiary) AS srentity
	, subaddress.addr1 AS sraddr1 
	, CASE WHEN  subaddress.addr2 IS NULL THEN ''
		ELSE subaddress.addr2 || '<br/>' END AS sraddr2
	, subaddress.city AS srcity
	, subaddress.state AS srstate
	, subaddress.zip AS srzip
	, BUILTIN.DF(subaddress.country) AS srcountry
	, job.custentity_scopingoverview AS overview
	, job.custentity_scopingassumptions AS assumptions
FROM job
INNER JOIN transactionline estimateline
	ON job.custentity_sr_scoping_quote = estimateline.transaction
INNER JOIN transaction estimate
	ON estimateline.transaction = estimate.id
INNER JOIN employee
	ON estimate.employee = employee.id
INNER JOIN subsidiary
	ON estimateline.subsidiary = subsidiary.id
INNER JOIN subsidiarymainaddress subaddress
	ON subsidiary.mainaddress = subaddress.nkey
INNER JOIN transactionbillingaddress billingadd
	ON estimate.billingaddress = billingadd.nkey
WHERE  job.id  = paramid
