SELECT CONCAT (BUILTIN.DF(job.parent) || ' : ', job.entityid) as name
FROM job
WHERE job.custentity_sr_allow_travel_expenses = 'T' AND BUILTIN.DF(job.entitystatus) != 'Closed'