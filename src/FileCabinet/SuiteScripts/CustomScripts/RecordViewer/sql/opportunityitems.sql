SELECT BUILTIN.DF(opportunityline.item) AS item
	, ABS(opportunityline.quantity) AS quantity_numeric
	, ABS(opportunityline.rate) AS rate_numeric
	, CASE WHEN opportunityline.ratepercent IS NOT NULL
		THEN '%'
		ELSE ''
	END AS percentdiscount_hide
	, CASE WHEN opportunityline.itemtype = 'Discount'
		THEN opportunityline.foreignamount 
		WHEN opportunityline.itemtype = 'Subtotal'
		THEN ABS(opportunityline.foreignamount)
		ELSE opportunityline.rate * ABS(opportunityline.quantity)
	END AS amount_numeric
	, opportunityline.memo AS memo
FROM transactionline opportunityline
WHERE opportunityline.mainline = 'F'
	AND opportunityline.taxline = 'F'
	AND opportunityline.taxline = 'F'
	AND  opportunityline.iscogs = 'F'
	AND transaction = ?
ORDER BY opportunityline.linesequencenumber