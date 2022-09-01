SELECT *, ROWNUM AS level
FROM
( SELECT matrix.custrecord_am_approverfield AS approverfield
	, matrix.custrecord_am_statusfield AS statusfield
	, matrix.custrecord_am_mtxstatus AS matrixstatusfield
	, approver.approver AS approver
FROM customrecord_apm_approvalmatrix matrix
INNER JOIN (
	SELECT employee.id AS approver
		, parammatrix AS matrix
	FROM employee
	WHERE employee.id IN (paramapprovers)
		AND employee.purchaseorderapprovallimit >= paramamount
	ORDER BY employee.custentity_employeetree DESC ) approver
	ON matrix.id = approver.matrix
WHERE matrix.custrecord_am_record = 'paramrecord')

