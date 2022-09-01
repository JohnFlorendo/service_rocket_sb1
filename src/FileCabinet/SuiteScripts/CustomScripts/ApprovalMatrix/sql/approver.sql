SELECT approver.custrecord_ma_approver AS nextapprover
	, approver.custrecord_ma_approvallevel AS approvallevel
	, matrix.custrecord_am_approverfield AS approverfield
	, matrix.custrecord_am_aprlvlfield AS levelfield
FROM customrecord_apm_approvalmatrix matrix
INNER JOIN customrecord_matrixapprover approver
	ON matrix.id = approver.custrecord_ma_approvalmatrix
WHERE approver.custrecord_ma_approvalmatrix = paramid
	AND ((approver.custrecord_ma_minamount <= paramamount
			AND approver.custrecord_max_amount >= paramamount)
		OR (approver.custrecord_ma_approvallevel > paramlevel 
			AND approver.custrecord_ma_approvallevel = paramlevel + 1  )))