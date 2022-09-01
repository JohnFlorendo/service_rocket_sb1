SELECT '1 PS Bookings' AS indicator
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -1), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS last_month
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -2), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS two_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -3), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS three_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -4), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS four_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -5), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS five_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -6), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS six_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -7), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS seven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -8), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS eight_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -9), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS nine_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -10), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS ten_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -11), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS eleven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -12), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END ) AS twelve_months_ago
FROM transaction
INNER JOIN transactionLine
	ON transaction.id = transactionLine.transaction
LEFT JOIN accountingperiod
	ON CURRENT_DATE BETWEEN accountingperiod.startdate AND accountingperiod.enddate
		AND accountingperiod.isquarter = 'F'
		AND accountingperiod.isposting = 'T'
INNER JOIN consolidatedexchangerate exchangerate
	ON transactionLine.subsidiary = exchangerate.fromsubsidiary
		AND exchangerate.tosubsidiary = 1
		AND exchangerate.postingperiod = accountingperiod.id
WHERE transaction.closedate  BETWEEN BUILTIN.RELATIVE_RANGES('LRY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('LRY', 'END', 'DATE')
	AND transactionLine.mainline = 'T'
	AND transaction.entitystatus IN ('13', '126')
	AND transaction.type = 'Opprtnty'
	AND transactionLine.class = '85'
	
UNION 

SELECT '2 PS Billings' AS indicator
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -1), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS last_month
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -2), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS two_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -3), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS three_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -4), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS four_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -5), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS five_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -6), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS six_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -7), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS seven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -8), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eight_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -9), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS nine_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -10), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS ten_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -11), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eleven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -12), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END ) AS twelve_months_ago
FROM  transactionline transactionline
INNER JOIN transaction transaction
	ON transactionline.transaction = transaction.id
INNER JOIN consolidatedexchangerate exchangerate
	ON transaction.postingperiod = exchangerate.postingperiod 
		AND transactionline.subsidiary = exchangerate.fromsubsidiary
		AND exchangerate.tosubsidiary = 1
WHERE transaction.trandate BETWEEN BUILTIN.RELATIVE_RANGES('LRY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('LRY', 'END', 'DATE')
	AND transactionLine.class = 85
	AND transactionLine.expenseaccount = 258
	AND transaction.posting = 'T'
	
UNION 

SELECT '3 PS Revenue' AS indicator
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -1), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS last_month
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -2), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS two_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -3), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS three_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -4), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS four_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -5), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS five_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -6), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS six_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -7), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS seven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -8), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eight_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -9), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS nine_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -10), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS ten_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -11), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eleven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -12), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END ) AS twelve_months_ago
FROM  transactionline transactionline
INNER JOIN transaction transaction
	ON transactionline.transaction = transaction.id
INNER JOIN consolidatedexchangerate exchangerate
	ON transaction.postingperiod = exchangerate.postingperiod 
		AND transactionline.subsidiary = exchangerate.fromsubsidiary
		AND exchangerate.tosubsidiary = 1
INNER JOIN Account
	ON transactionLine.expenseaccount = account.id
WHERE transaction.trandate BETWEEN BUILTIN.RELATIVE_RANGES('LRY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('LRY', 'END', 'DATE')
	AND transactionLine.class = 85
	AND account.accttype = 'Income'
	AND transaction.posting = 'T'
	
UNION 

SELECT '4 PS People Expenses' AS indicator
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -1), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS last_month
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -2), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS two_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -3), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS three_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -4), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS four_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -5), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS five_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -6), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS six_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -7), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS seven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -8), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eight_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -9), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS nine_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -10), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS ten_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -11), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eleven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -12), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END ) AS twelve_months_ago
FROM  transactionline transactionline
INNER JOIN transaction transaction
	ON transactionline.transaction = transaction.id
INNER JOIN consolidatedexchangerate exchangerate
	ON transaction.postingperiod = exchangerate.postingperiod 
		AND transactionline.subsidiary = exchangerate.fromsubsidiary
		AND exchangerate.tosubsidiary = 1
INNER JOIN account
ON transactionLine.expenseaccount = account.id
WHERE transaction.trandate BETWEEN BUILTIN.RELATIVE_RANGES('LRY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('LRY', 'END', 'DATE')
	AND transactionLine.class = 85
	AND transaction.posting = 'T'
	AND account.accttype IN ('Expense','OthIncome','OthExpense','COGS')
	AND transactionLine.expenseaccount IN (284,285,286,287,678,932,288,916,917,918,289,290,291,292,841,293,294,295,296,877,297,298,299,300,301,302,303,304)
	AND transactionLine.department NOT IN (42,1,56,57,29)
	
UNION
SELECT '5 PS Direct Expenses' AS indicator
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -1), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS last_month
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -2), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS two_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -3), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS three_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -4), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS four_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -5), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS five_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -6), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS six_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -7), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS seven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -8), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eight_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -9), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS nine_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -10), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS ten_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -11), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eleven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -12), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END ) AS twelve_months_ago
FROM  transactionline transactionline
INNER JOIN transaction transaction
	ON transactionline.transaction = transaction.id
INNER JOIN consolidatedexchangerate exchangerate
	ON transaction.postingperiod = exchangerate.postingperiod 
		AND transactionline.subsidiary = exchangerate.fromsubsidiary
		AND exchangerate.tosubsidiary = 1
LEFT JOIN Account
ON transactionLine.expenseaccount = Account.id
WHERE transaction.trandate BETWEEN BUILTIN.RELATIVE_RANGES('LRY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('LRY', 'END', 'DATE')
	AND transactionLine.class = 85
	AND transaction.posting = 'T'
	AND Account.accttype IN ('Expense','OthIncome','OthExpense','COGS')
	AND transactionLine.expenseaccount NOT IN (284, 285, 286, 287, 678, 932, 288, 916, 917, 918, 289, 290, 291, 292, 841, 293, 294, 295, 296, 877, 820, 821, 297, 298, 299, 300, 301, 302, 303, 304, 839, 924, 925, 840)
	AND transactionLine.department NOT IN (42,1,56,57,29)
	
UNION
SELECT '6 PS Allocated Expenses' AS indicator
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -1), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS last_month
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -2), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS two_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -3), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS three_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -4), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS four_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -5), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS five_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -6), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS six_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -7), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS seven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -8), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eight_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -9), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS nine_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -10), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS ten_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -11), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eleven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -12), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END ) AS twelve_months_ago
FROM  transactionline transactionline
INNER JOIN transaction transaction
	ON transactionline.transaction = transaction.id
INNER JOIN consolidatedexchangerate exchangerate
	ON transaction.postingperiod = exchangerate.postingperiod 
		AND transactionline.subsidiary = exchangerate.fromsubsidiary
		AND exchangerate.tosubsidiary = 1
INNER JOIN account
ON transactionLine.expenseaccount = account.id
WHERE transaction.trandate BETWEEN BUILTIN.RELATIVE_RANGES('LRY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('LRY', 'END', 'DATE')
	AND transactionLine.class = 85
	AND transaction.posting = 'T'
	AND account.accttype IN ('Expense','OthIncome','OthExpense','COGS')
	AND transactionLine.expenseaccount IN (820, 821, 839, 924, 925, 840)
	AND transactionLine.department NOT IN (42,1,56,57,29)
	
UNION

SELECT 'PS Net Income' AS indicator
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -1), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS last_month
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -2), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS two_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -3), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS three_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -4), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS four_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -5), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS five_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -6), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS six_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -7), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS seven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -8), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eight_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -9), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS nine_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -10), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS ten_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -11), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eleven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -12), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END ) AS twelve_months_ago
FROM  transactionline transactionline
INNER JOIN transaction transaction
	ON transactionline.transaction = transaction.id
INNER JOIN consolidatedexchangerate exchangerate
	ON transaction.postingperiod = exchangerate.postingperiod 
		AND transactionline.subsidiary = exchangerate.fromsubsidiary
		AND exchangerate.tosubsidiary = 1
INNER JOIN account
ON transactionLine.expenseaccount = account.id
WHERE transaction.trandate BETWEEN BUILTIN.RELATIVE_RANGES('LRY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('LRY', 'END', 'DATE')
	AND transactionLine.class = 85
	AND transaction.posting = 'T'
	AND account.accttype IN ('Expense','OthIncome','OthExpense','COGS', 'Income')