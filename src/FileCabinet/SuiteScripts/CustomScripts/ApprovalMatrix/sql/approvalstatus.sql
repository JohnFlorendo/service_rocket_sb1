SELECT
	Name,
	ID
FROM
	customlist_apm_approvalstatus
WHERE
	IsInactive = 'F'
ORDER BY
	ID