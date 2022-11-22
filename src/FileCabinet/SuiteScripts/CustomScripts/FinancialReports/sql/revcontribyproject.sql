SELECT BUILTIN.DF(charge.billto) AS project
	, BUILTIN.DF(timebill.employee) AS employee
	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 0
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 1
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS amountonemonthago
    , TO_NUMBER(CASE WHEN totalmonth.subonemonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 0
            AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 1
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subonemonthago_currency) * 100, 2) END) AS percentonemonthago

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 1
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 2
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS amounttwomonthago
    , TO_NUMBER(CASE WHEN totalmonth.subtwomonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 1
            AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 2
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subtwomonthago_currency) * 100, 2) END) AS percenttwomonthago

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 2
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 3
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS amountthreemonthago
    , TO_NUMBER(CASE WHEN totalmonth.subthreemonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 2
            AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 3
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subthreemonthago_currency) * 100, 2) END) AS percentthreemonthago

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 3
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 4
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS amountfourmonthago
    , TO_NUMBER(CASE WHEN totalmonth.subfourmonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 3
            AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 4
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subfourmonthago_currency) * 100, 2) END) AS percentfourmonthago

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 4
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 5
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS amountfivemonthago
	, TO_NUMBER(CASE WHEN totalmonth.subfivemonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 4
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 5
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) / totalmonth.subfivemonthago_currency) * 100, 2) END) AS percentfivemonthago

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 5
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 6
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS amountsixmonthago
    , TO_NUMBER(CASE WHEN totalmonth.subsixmonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 5
            AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 6
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subsixmonthago_currency) * 100, 2) END) AS percentsixmonthago

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 6
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 7
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS amountsevenmonthago
    , TO_NUMBER(CASE WHEN totalmonth.subsevenmonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 6
            AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 7
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subsevenmonthago_currency) * 100, 2) END) AS percentsevenmonthago

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 7
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 8
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS amounteightmonthago
    , TO_NUMBER(CASE WHEN totalmonth.subeightmonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 7
            AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 8
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subeightmonthago_currency) * 100, 2) END) AS percenteightmonthago

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 8
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <=9
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS amountninemonthago
    , TO_NUMBER(CASE WHEN totalmonth.subninemonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 8
            AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 9
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subninemonthago_currency) * 100, 2) END) AS percentninemonthago

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 9
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <=10
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS amounttenmonthago
    , TO_NUMBER(CASE WHEN totalmonth.subtenmonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 9
            AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 10
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subtenmonthago_currency) * 100, 2) END) AS percenttenmonthago

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 10
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <=11
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS amountelevenmonthago
    , TO_NUMBER(CASE WHEN totalmonth.subelevenmonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 10
            AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 11
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subelevenmonthago_currency) * 100, 2) END) AS percentelevenmonthago

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 11
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <=12
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS amounttwelvemonthago
    , TO_NUMBER(CASE WHEN totalmonth.subtwelvemonthago_currency = 0 THEN 0 ELSE ROUND((SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 11
            AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 12
            THEN ROUND(BUILTIN.CURRENCY_CONVERT(charge.amount, 1, period.startdate), 2)
            ELSE 0
            END) / totalmonth.subtwelvemonthago_currency) * 100, 2) END) AS percenttwelvemonthago

FROM charge

LEFT JOIN TimeBill timebill
	ON timebill.id = charge.timerecord
	LEFT JOIN (
            SELECT
                invoice.id AS id,
                BUILTIN.DF(transactionLine.item) AS item,
                transactionLine.rate AS rate,
                invoice.postingperiod AS postingperiod
            FROM
                transaction invoice
                LEFT JOIN transactionLine ON invoice.id = transactionLine.transaction
            WHERE
                invoice.type = 'CustInvc'
                AND transactionLine.taxLine = 'F'
                AND transactionLine.isCogs = 'F'
                AND transactionLine.mainLine = 'F'
        ) invoice ON charge.invoice = invoice.id
--LEFT JOIN transaction invoice
--	ON invoice.id = charge.invoice
LEFT JOIN accountingPeriod period
	ON period.id = invoice.postingperiod
LEFT  JOIN (
SELECT subcharge.billto AS subproject
	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 0
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 1
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subonemonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 1
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 2
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subtwomonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 2
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 3
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subthreemonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 3
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 4
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subfourmonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 4
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 5
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subfivemonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 5
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 6
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subsixmonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 6
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 7
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subsevenmonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 7
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <= 8
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subeightmonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 8
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <=9
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subninemonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 9
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <=10
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subtenmonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 10
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <=11
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subelevenmonthago_currency

	, SUM(CASE WHEN MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) > 11
		AND MONTHS_BETWEEN(TO_DATE('paramtodate', 'DD-MM-YYYY'), period.startdate) <=12
		THEN ROUND(BUILTIN.CURRENCY_CONVERT(subcharge.amount, 1, period.startdate), 2)
		ELSE 0
		END) AS subtwelvemonthago_currency
FROM charge subcharge
LEFT JOIN TimeBill timebill
	ON timebill.id = subcharge.timerecord
LEFT JOIN transaction invoice
	ON invoice.id = subcharge.invoice
LEFT JOIN accountingPeriod period
	ON period.id = invoice.postingperiod
WHERE BUILTIN.DF(use) = 'Actual' AND BUILTIN.DF(subcharge.stage) = 'Processed'
GROUP BY subcharge.billto
) totalmonth
ON charge.billto = totalmonth.subproject
WHERE BUILTIN.DF(use) = 'Actual' AND BUILTIN.DF(charge.stage) = 'Processed'
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
	, totalmonth.subtwelvemonthago_currency


ORDER BY project