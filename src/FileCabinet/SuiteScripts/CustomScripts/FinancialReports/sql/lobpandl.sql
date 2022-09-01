SELECT 1 AS order_hide
	, '1: Bookings 📘' AS indicator
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -12), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS onemonthago_currency
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -11), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS twomonthago_currency
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -10), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS threemonthago_currency
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -9), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS fourmonthago_currency
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -8), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS fivemonthago_currency
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -7), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS sixmonthago_currency
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -6), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS sevenmonthago_currency
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -5), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS eightmonthago_currency
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -4), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS ninemonthago_currency
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -3), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS tenmonthago_currency
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -2), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END) AS elevenmonthago_currency
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -1), 'YYYY-MM') = TO_CHAR (transaction.closedate, 'YYYY-MM' )
	THEN ROUND(transaction.projectedtotal * transaction.exchangerate * exchangerate.historicalrate, 2)
	ELSE 0
	END ) AS twelvenmonthago_currency
FROM transaction
INNER JOIN transactionline
	ON transaction.id = transactionline.transaction
LEFT JOIN accountingperiod
	ON accountingperiod.startdate BETWEEN BUILTIN.RELATIVE_RANGES('TM', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('TM', 'END', 'DATE') 
		AND accountingperiod.enddate BETWEEN BUILTIN.RELATIVE_RANGES('TM', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('TM', 'END', 'DATE')
		AND accountingperiod.isquarter = 'F'
		AND accountingperiod.isposting = 'T'
INNER JOIN consolidatedexchangerate exchangerate
	ON transactionline.subsidiary = exchangerate.fromsubsidiary
		AND exchangerate.tosubsidiary = 1
		AND exchangerate.postingperiod = accountingperiod.id
WHERE transaction.closedate  BETWEEN BUILTIN.RELATIVE_RANGES('LRY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('LRY', 'END', 'DATE')
	AND transactionline.mainline = 'T'
	AND transaction.entitystatus IN (13, 126)
	AND transaction.type = 'Opprtnty'
	AND transactionline.class = ?
	
UNION 

SELECT 2 AS order_hide
	,  '2: Billings' AS indicator
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -12), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS last_month
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -11), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS two_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -10), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS three_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -9), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS four_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -8), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS five_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -7), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS six_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -6), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS seven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -5), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eight_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -4), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS nine_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -3), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS ten_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -2), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eleven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -1), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
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
	AND transactionline.expenseaccount = 258
	AND transaction.posting = 'T'
	AND transactionline.class = ?
	
UNION 

SELECT 3 AS order_hide
	,  '3: Revenue 💲' AS indicator
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -12), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS last_month
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -11), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS two_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -10), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS three_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -9), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS four_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -8), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS five_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -7), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS six_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -6), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS seven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -5), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eight_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -4), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS nine_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -3), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS ten_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -2), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eleven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -1), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
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
	ON transactionline.expenseaccount = account.id
WHERE transaction.trandate BETWEEN BUILTIN.RELATIVE_RANGES('LRY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('LRY', 'END', 'DATE')
	AND account.accttype = 'Income'
	AND transaction.posting = 'T'
	AND transactionline.class = ?

UNION
SELECT 4 AS order_hide
	,  '4: CoS' AS indicator
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -12), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS last_month
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -11), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS two_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -10), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS three_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -9), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS four_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -8), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS five_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -7), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS six_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -6), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS seven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -5), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eight_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -4), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS nine_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -3), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS ten_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -2), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eleven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -1), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
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
ON transactionline.expenseaccount = Account.id
WHERE transaction.trandate BETWEEN BUILTIN.RELATIVE_RANGES('LRY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('LRY', 'END', 'DATE')
	AND transaction.posting = 'T'
	AND Account.accttype IN ('COGS')
	AND transactionline.class = ?
		
UNION 

SELECT 5 AS order_hide
	,  '5: Expenses 💸' AS indicator
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -12), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS last_month
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -11), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS two_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -10), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS three_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -9), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS four_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -8), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS five_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -7), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS six_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -6), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS seven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -5), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eight_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -4), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS nine_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -3), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS ten_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -2), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eleven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -1), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
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
ON transactionline.expenseaccount = account.id
WHERE transaction.trandate BETWEEN BUILTIN.RELATIVE_RANGES('LRY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('LRY', 'END', 'DATE')
	AND transaction.posting = 'T'
	AND account.accttype IN ('Expense')
	AND transactionline.class = ?
	
UNION

SELECT 6 AS order_hide
	,  '5.a: People Expenses 💵' AS indicator
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -12), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS last_month
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -11), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS two_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -10), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS three_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -9), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS four_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -8), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS five_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -7), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS six_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -6), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS seven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -5), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eight_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -4), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS nine_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -3), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS ten_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -2), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eleven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -1), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
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
ON transactionline.expenseaccount = account.id
WHERE transaction.trandate BETWEEN BUILTIN.RELATIVE_RANGES('LRY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('LRY', 'END', 'DATE')
	AND transaction.posting = 'T'
	AND account.accttype IN ('Expense')
	AND ( account.acctnumber LIKE '61%'
			OR account.acctnumber LIKE '62%'
			OR account.acctnumber LIKE '63%')
	AND transactionline.class = ?
	
UNION

SELECT 7 AS order_hide
	,  '5.b: Direct Expenses 💴' AS indicator
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -12), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS last_month
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -11), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS two_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -10), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS three_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -9), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS four_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -8), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS five_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -7), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS six_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -6), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS seven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -5), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eight_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -4), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS nine_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -3), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS ten_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -2), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eleven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -1), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
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
ON transactionline.expenseaccount = account.id
WHERE transaction.trandate BETWEEN BUILTIN.RELATIVE_RANGES('LRY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('LRY', 'END', 'DATE')
	AND transaction.posting = 'T'
	AND account.accttype IN ('Expense')
	AND ( account.acctnumber NOT LIKE '61%'
			OR account.acctnumber NOT LIKE '62%'
			OR account.acctnumber NOT LIKE '63%')
	AND transactionline.expenseaccount NOT IN (839, 840, 924, 925)
	AND transactionline.class = ?
	
UNION

SELECT 8 AS order_hide
	,  '5.c: Allocated Expenses 💴' AS indicator
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -12), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS last_month
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -11), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS two_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -10), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS three_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -9), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS four_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -8), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS five_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -7), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS six_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -6), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS seven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -5), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eight_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -4), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS nine_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -3), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS ten_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -2), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0) - NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0))
		* transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eleven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -1), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
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
ON transactionline.expenseaccount = account.id
WHERE transaction.trandate BETWEEN BUILTIN.RELATIVE_RANGES('LRY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('LRY', 'END', 'DATE')
	AND transaction.posting = 'T'
	AND account.accttype IN ('Expense')
	AND transactionline.expenseaccount IN (839, 840, 924, 925)
	AND transactionline.class = ?
	
UNION

SELECT 9 AS order_hide
	,  '6: Net Income 💰' AS indicator
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -12), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS last_month
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -11), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS two_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -10), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS three_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -9), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS four_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -8), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS five_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -7), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS six_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -6), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS seven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -5), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eight_months_ago
	, SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -4), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS nine_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -3), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS ten_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -2), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
	THEN ROUND(( NVL2( transactionline.creditforeignamount, transactionline.creditforeignamount, 0) - NVL2( transactionline.debitforeignamount, transactionline.debitforeignamount, 0))
			 * transaction.exchangerate * exchangerate.averagerate, 2)
	ELSE 0
	END) AS eleven_months_ago
    , SUM(CASE WHEN TO_CHAR(ADD_MONTHS(CURRENT_DATE, -1), 'YYYY-MM') = TO_CHAR (transaction.trandate, 'YYYY-MM' )
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
ON transactionline.expenseaccount = account.id
WHERE transaction.trandate BETWEEN BUILTIN.RELATIVE_RANGES('LRY', 'START', 'DATE') AND BUILTIN.RELATIVE_RANGES('LRY', 'END', 'DATE')
	AND transaction.posting = 'T'
	AND account.accttype IN ('Income', 'COGS', 'Expense','OthIncome','OthExpense')
	AND transactionline.class = ?