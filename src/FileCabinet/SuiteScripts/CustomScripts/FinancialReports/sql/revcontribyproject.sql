SELECT BUILTIN.DF(charge.billto) AS project
	, BUILTIN.DF(timebill.employee) AS employee
	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 0
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 1
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS onemonthago_currency
    , TO_NUMBER(CASE WHEN totalmonth.subonemonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 0
            AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 1
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subonemonthago_currency) * 100, 2) END)

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 1
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 2
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS twomonthago_currency
    , TO_NUMBER(CASE WHEN totalmonth.subtwomonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 1
            AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 2
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subtwomonthago_currency) * 100, 2) END)

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 2
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 3
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS threemonthago_currency
    , TO_NUMBER(CASE WHEN totalmonth.subthreemonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 2
            AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 3
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subthreemonthago_currency) * 100, 2) END)

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 3
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 4
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS fourmonthago_currency
    , TO_NUMBER(CASE WHEN totalmonth.subfourmonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 3
            AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 4
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subfourmonthago_currency) * 100, 2) END)

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 4
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 5
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS fivemonthago_currency
	, TO_NUMBER(CASE WHEN totalmonth.subfivemonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 4
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 5
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) / totalmonth.subfivemonthago_currency) * 100, 2) END)

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 5
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 6
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS sixmonthago_currency
    , TO_NUMBER(CASE WHEN totalmonth.subsixmonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 5
            AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 6
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subsixmonthago_currency) * 100, 2) END)

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 6
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 7
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS sevenmonthago_currency
    , TO_NUMBER(CASE WHEN totalmonth.subsevenmonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 6
            AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 7
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subsevenmonthago_currency) * 100, 2) END)

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 7
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 8
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS eightmonthago_currency
    , TO_NUMBER(CASE WHEN totalmonth.subeightmonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 7
            AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 8
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subeightmonthago_currency) * 100, 2) END)

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 8
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <=9
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS ninemonthago_currency
    , TO_NUMBER(CASE WHEN totalmonth.subninemonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 8
            AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 9
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subninemonthago_currency) * 100, 2) END)

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 9
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <=10
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS tenmonthago_currency
    , TO_NUMBER(CASE WHEN totalmonth.subtenmonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 9
            AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 10
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subtenmonthago_currency) * 100, 2) END)

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 10
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <=11
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS elevenmonthago_currency
    , TO_NUMBER(CASE WHEN totalmonth.subelevenmonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 10
            AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 11
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subelevenmonthago_currency) * 100, 2) END)

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 11
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <=12
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS twelvenmonthago_currency
    , TO_NUMBER(CASE WHEN totalmonth.subtwelvenmonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 11
            AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 12
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subtwelvenmonthago_currency) * 100, 2) END)

FROM charge

LEFT JOIN TimeBill timebill
	ON timebill.id = charge.timerecord
LEFT JOIN transaction invoice
	ON invoice.id = charge.invoice
LEFT JOIN accountingPeriod period
	ON period.id = invoice.postingperiod
LEFT  JOIN (
SELECT subcharge.billto AS subproject
	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 0
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 1
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subonemonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 1
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 2
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subtwomonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 2
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 3
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subthreemonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 3
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 4
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subfourmonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 4
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 5
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subfivemonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 5
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 6
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subsixmonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 6
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 7
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subsevenmonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 7
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <= 8
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subeightmonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 8
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <=9
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subninemonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 9
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <=10
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subtenmonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 10
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <=11
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subelevenmonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) > 11
		AND MONTHS_BETWEEN(TO_DATE('01/08/2022', 'DD-MM-YYYY'), period.startdate) <=12
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subtwelvenmonthago_currency
FROM charge subcharge
LEFT JOIN TimeBill timebill
	ON timebill.id = subcharge.timerecord
LEFT JOIN transaction invoice
	ON invoice.id = subcharge.invoice
LEFT JOIN accountingPeriod period
	ON period.id = invoice.postingperiod
WHERE BUILTIN.DF(use) = 'Actual' AND BUILTIN.DF(chargetype) = 'Time-Based' AND BUILTIN.DF(subcharge.stage) = 'Processed'
GROUP BY subcharge.billto
) totalmonth
ON charge.billto = totalmonth.subproject
WHERE BUILTIN.DF(use) = 'Actual' AND BUILTIN.DF(chargetype) = 'Time-Based' AND BUILTIN.DF(charge.stage) = 'Processed'
GROUP BY BUILTIN.DF(charge.billto)
	, BUILTIN.DF(timebill.employee)
	, totalmonth.subonemonthago_currency
	, totalmonth.subtwomonthago_currency
	, totalmonth.subthreemonthago_currency
	, totalmonth.subfourmonthago_currency
	, totalmonth.subfivemonthago_currency
	, totalmonth.subsixmonthago_currency
	, totalmonth.subsevenmonthago_currency
	, totalmonth.subeightmonthago_currency
	, totalmonth.subninemonthago_currency
	, totalmonth.subtenmonthago_currency
	, totalmonth.subelevenmonthago_currency
	, totalmonth.subtwelvenmonthago_currency


ORDER BY project