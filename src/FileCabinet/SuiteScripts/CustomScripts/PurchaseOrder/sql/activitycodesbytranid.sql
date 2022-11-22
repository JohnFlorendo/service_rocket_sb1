SELECT transactionline.custcol7 AS activitycode,
       BUILTIN.DF(transactionline.custcol7) AS activitycodetext,
       transactionline.id AS line
FROM transactionline
       INNER JOIN transaction ON ( transaction.id = transactionline.transaction AND transactionline.mainline='F')
WHERE transaction.tranId= ? AND transactionline.custcol7 IS NOT NULL
ORDER BY transactionline.linesequencenumber