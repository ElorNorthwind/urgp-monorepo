-- Семьи по сроку подписания по классификатору
WITH contracts AS (
	SELECT
		DATE_PART('year', contract_date) as year,
		DATE_PART('month', contract_date) as month,
		COUNT(*) FILTER (WHERE contract_date - plan_first_resettlement_start <= 60 AND contract_date IS NOT NULL) AS fast,
	    COUNT(*) FILTER (WHERE contract_date - plan_first_resettlement_start > 60 AND contract_date IS NOT NULL) AS slow
	FROM renovation.apartments_classified
	GROUP BY DATE_PART('year', contract_date),
             DATE_PART('month', contract_date)
), date_series AS (
	SELECT *, make_date(year, month, 1) as month_date
	FROM generate_series(1,12) as month
	CROSS JOIN generate_series(2017,2030) as year
), recent_window AS (
	SELECT d.year, 
	       d.month, 
	       to_char(d.month_date, 'TMMon YY') as period, 
	       to_char(d.month_date, 'TMMonth YYYY') as "fullPeriod", 
	       COAlESCE(c.fast, 0)::int as fast, 
	       COAlESCE(c.slow, 0)::int as slow
	FROM date_series d
	LEFT JOIN contracts c ON c.year = d.year AND c.month = d.month
	WHERE d.month_date > NOW()::date - '2 years'::interval AND d.month_date <= NOW()::date
)
SELECT * FROM recent_window
ORDER BY year, month;