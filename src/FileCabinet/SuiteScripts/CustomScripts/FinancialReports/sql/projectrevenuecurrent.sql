SELECT BUILTIN.DF(journalline.class) AS class_grouped
	, BUILTIN.DF(journalline.entity) AS project_customer
	, BUILTIN.DF(revenueplan.item) AS item
	
	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) > 0 
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) <= 1
		THEN journalline.creditforeignamount * exchangerate.averagerate
		ELSE 0
		END) AS onemonthago_currency
		
	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) > 1 
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) <= 2
		THEN journalline.creditforeignamount * exchangerate.averagerate
		ELSE 0
		END) AS twomonthago_currency
		
	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) > 2 
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) <= 3
		THEN journalline.creditforeignamount * exchangerate.averagerate
		ELSE 0
		END) AS threemonthago_currency
		
	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) > 3 
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) <= 4
		THEN journalline.creditforeignamount * exchangerate.averagerate
		ELSE 0
		END) AS fourmonthago_currency
		
	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) > 4 
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) <= 5
		THEN journalline.creditforeignamount * exchangerate.averagerate
		ELSE 0
		END) AS fivemonthago_currency
		
	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) > 5 
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) <= 6
		THEN journalline.creditforeignamount * exchangerate.averagerate
		ELSE 0
		END) AS sixmonthago_currency
		
	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) > 6 
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) <= 7
		THEN journalline.creditforeignamount * exchangerate.averagerate
		ELSE 0
		END) AS sevenmonthago_currency
		
	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) > 7 
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) <= 8
		THEN journalline.creditforeignamount * exchangerate.averagerate
		ELSE 0
		END) AS eightmonthago_currency
		
	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) > 8 
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) <=9
		THEN journalline.creditforeignamount * exchangerate.averagerate
		ELSE 0
		END) AS ninemonthago_currency
		
	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) > 9 
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) <=10
		THEN journalline.creditforeignamount * exchangerate.averagerate
		ELSE 0
		END) AS tenmonthago_currency
		
	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) > 10 
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) <=11
		THEN journalline.creditforeignamount * exchangerate.averagerate
		ELSE 0
		END) AS elevenmonthago_currency
		
	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) > 11 
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), journal.trandate) <=12
		THEN journalline.creditforeignamount * exchangerate.averagerate
		ELSE 0
		END) AS twelvenmonthago_currency
	, BUILTIN.DF(journalline.subsidiary) AS subsidiary
	, BUILTIN.DF(journal.currency) AS currencyrate
FROM  transactionline journalline
INNER JOIN transaction journal
	ON journalline.transaction = journal.id
INNER JOIN consolidatedexchangerate exchangerate
	ON journal.postingperiod = exchangerate.postingperiod 
		AND journal.currency = exchangerate.fromcurrency
		AND exchangerate.tocurrency = 1
INNER JOIN transaction revenuearrangement
	ON journalline.createdfrom = revenuearrangement.id
		AND revenuearrangement.type = 'RevArrng'
INNER JOIN revenueelement
	ON revenuearrangement.id = revenueelement.revenuearrangement
INNER JOIN revenueplan
	ON revenueelement.id = revenueplan.createdfrom
		AND journalline.custcol_sr_rev_rec_plan = revenueplan.id
WHERE journal.trandate BETWEEN BUILTIN.RELATIVE_RANGES('LRY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('LRY', 'END', 'DATE')
GROUP BY BUILTIN.DF(journalline.entity)
	, BUILTIN.DF(journalline.class)
	, BUILTIN.DF(revenueplan.item)
	, BUILTIN.DF(journalline.subsidiary)
	, BUILTIN.DF(journal.currency)
	
