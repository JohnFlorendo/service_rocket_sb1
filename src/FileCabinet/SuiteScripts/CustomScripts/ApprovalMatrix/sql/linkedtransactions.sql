SELECT DISTINCT
	NextTrans.ID,
	NextTrans.createdDate,
	NextTrans.TranDate,
	BUILTIN.DF( NextTrans.Type ) AS Type,
	NextTrans.TranID,
	BUILTIN.DF(NextTrans.Status)

FROM
	NextTransactionLineLink AS NextTransLineLink
	INNER JOIN Transaction AS NextTrans ON
		( NextTrans.ID = NextTransLineLink.NextDoc  )
WHERE
	NextTransLineLink.PreviousDoc = ? AND BUILTIN.DF(NextTrans.Status) = 'Purchase Order : Pending Supervisor Approval'
ORDER BY
	NextTrans.createdDate,
	NextTrans.ID