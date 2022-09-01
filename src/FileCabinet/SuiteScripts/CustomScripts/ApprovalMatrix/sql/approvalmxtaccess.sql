SELECT
	role.id AS ID
FROM
	employee
	INNER JOIN employeerolesforsearch ON
		( employeerolesforsearch.entity = employee.id )
	INNER JOIN role ON
		( role.id = employeerolesforsearch.role )
		AND ( role.isinactive = 'F' )
WHERE
	employee.id = 'userid'