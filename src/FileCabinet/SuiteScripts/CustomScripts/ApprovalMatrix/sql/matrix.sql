SELECT matrix.id AS matrix
	, matrix.custrecord_am_matrixfield AS matrixfield
	, matrix.custrecord_am_aprlvlfield AS levelfield
	, matrix.custrecord_am_statusfield AS statusfield
	, matrix.custrecord_am_mtxstatus AS matrixstatusfield
	, matrix.custrecord_am_approverfield AS approverfield
	, matrix.custrecord_am_ownerfield AS ownerfield
	, matrix.custrecord_am_amountfield AS amountfield
FROM customrecord_apm_approvalmatrix matrix
WHERE matrix.isinactive = 'F'
	AND matrix.custrecord_am_record = 'paramrecord'
	/*AND ((matrix.custrecord_am_record = 'paramrecord'
			AND matrix.custrecord_am_subsidiary = paramsubsidiary)
		OR (matrix.custrecord_am_record = 'paramrecord'
			AND matrix.custrecord_am_class = paramclass)
		OR (matrix.custrecord_am_record = 'paramrecord'
			AND matrix.custrecord_am_location = paramlocation)
		OR (matrix.custrecord_am_record = 'paramrecord'
			AND matrix.custrecord_am_department = paramdept)
		)*/