SELECT
	'(' || employee.custentity_employee_number || ') ' || employee.entityid AS employee, 
	customlist226.name AS line_business, 
	subsidiary.name AS subsidiary,
	timeofftype.name AS timeoff_type,
	SUM(case when timeoffchangetype= 'ACCRUAL' OR timeoffchangetype='MANUAL_INCREASE'  then timeoffchange.amount else 0 end)   AS accrual_numeric,
    	SUM(case when timeoffchangetype = 'USAGE' then  timeoffchange.amount else 0 end)   AS usage_numeric,
	SUM(case when timeoffchangetype= 'ACCRUAL' OR timeoffchangetype='MANUAL_INCREASE' OR timeoffchangetype='USAGE'  then timeoffchange.amount else 0 end) AS balance_numeric
	
FROM 
	timeoffchange
LEFT JOIN
	employee
ON
	timeoffchange.employee = employee.id
LEFT JOIN
	subsidiary
ON
	employee.subsidiary = subsidiary.id
LEFT JOIN
	timeofftype
ON
	timeoffchange.timeofftype = timeofftype.id
LEFT JOIN
	customlist226
ON
	employee.custentity4 = customlist226.id
WHERE
	employee.isinactive = 'F' AND employee.custentity_employee_number IS NOT NULL
GROUP BY
	customlist226.name,
	subsidiary.name,
	employee.custentity_employee_number,
	employee.entityid,
	subsidiary.name,
	timeofftype.name