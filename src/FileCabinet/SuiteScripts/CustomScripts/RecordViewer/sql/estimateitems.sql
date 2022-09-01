SELECT BUILTIN.DF(estimateline.item) AS item
	, ABS(estimateline.quantity) AS quantity_numeric
	, ABS(estimateline.rate) AS rate_numeric
	, CASE WHEN estimateline.ratepercent IS NOT NULL
		THEN '%'
		ELSE ''
	END AS percentdiscount_hide
	, CASE WHEN estimateline.itemtype = 'Discount'
		THEN estimateline.foreignamount 
		WHEN estimateline.itemtype = 'Subtotal'
		THEN ABS(estimateline.foreignamount)
		ELSE estimateline.rate * ABS(estimateline.quantity)
	END AS amount_numeric
	, BUILTIN.DF(estimateline.class) AS class
	, estimateline.custcol_nvy_sen AS sen
	, estimateline.memo AS memo_truncate
FROM transactionline estimateline
WHERE estimateline.mainline = 'F'
	AND estimateline.taxline = 'F'
	AND estimateline.taxline = 'F'
	AND estimateline.iscogs = 'F'
	AND estimateline.transaction = ?
ORDER BY estimateline.linesequencenumber