SELECT BUILTIN.DF(journalline.class) AS class_grouped
	, BUILTIN.DF(journalline.entity) AS project_customer
	, BUILTIN.DF(revenueplan.item) AS item
	, SUM (CASE WHEN journal.trandate BETWEEN BUILTIN.RELATIVE_RANGES('TM', 'START', 'DATE') 
			AND BUILTIN.RELATIVE_RANGES('TM', 'END', 'DATE') 
		THEN BUILTIN.CURRENCY_CONVERT(journalline.creditforeignamount, 1, journal.trandate)
		ELSE 0
		END) AS this_month_currency
	, SUM (CASE WHEN journal.trandate BETWEEN BUILTIN.RELATIVE_RANGES('LM', 'START', 'DATE') 
			AND BUILTIN.RELATIVE_RANGES('LM', 'END', 'DATE') 
		THEN BUILTIN.CURRENCY_CONVERT(journalline.creditforeignamount, 1, journal.trandate)
		ELSE 0
		END) AS last_month_currency
	, SUM (CASE WHEN journal.trandate BETWEEN BUILTIN.RELATIVE_RANGES('MBL', 'START', 'DATE') 
			AND BUILTIN.RELATIVE_RANGES('MBL', 'END', 'DATE') 
		THEN  BUILTIN.CURRENCY_CONVERT(journalline.creditforeignamount, 1, journal.trandate)
		ELSE 0
		END) AS month_before_last_currency
FROM  transactionline journalline
INNER JOIN transaction journal
	ON journalline.transaction = journal.id
INNER JOIN transaction revenuearrangement
	ON journalline.createdfrom = revenuearrangement.id
		AND revenuearrangement.type = 'RevArrng'
INNER JOIN revenueelement
	ON revenuearrangement.id = revenueelement.revenuearrangement
INNER JOIN revenueplan
	ON revenueelement.id = revenueplan.createdfrom
		AND journalline.custcol_sr_rev_rec_plan = revenueplan.id
WHERE TRUNC( journal.trandate) BETWEEN TO_DATE('2021-12-01', 'YYYY-MM-DD') AND TO_DATE('2022-02-28', 'YYYY-MM-DD')
GROUP BY BUILTIN.DF(journalline.entity)
	, BUILTIN.DF(journalline.class)
	, BUILTIN.DF(revenueplan.item)