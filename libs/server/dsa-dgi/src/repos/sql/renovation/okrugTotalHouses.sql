-- свод по округам
WITH ao_ordering(okrug, rank) AS (
	VALUES
	('ЦАО',1),
	('САО',2),
	('СВАО',3),
	('ВАО',4),
	('ЮВАО',5),
	('ЮАО',6),
	('ЮЗАО',7),
	('ЗАО',8),
	('СЗАО',9),
	('ЗелАО',10),
	('ТАО',11),
	('НАО',12)
)
SELECT b.okrug, 
       COUNT(*)::int as total,
       COUNT(*) FILTER (WHERE (b.terms->'actual'->>'demolitionEnd')::date IS NOT NULL)::int as done,
       COUNT(*) FILTER (WHERE (b.terms->'actual'->>'demolitionEnd')::date IS NULL AND (b.terms->'actual'->>'firstResetlementStart')::date IS NOT NULL)::int as "inProgress",
       COUNT(*) FILTER (WHERE (b.terms->'actual'->>'firstResetlementStart')::date IS NULL)::int as "notStarted"
FROM renovation.buildings_old b
LEFT JOIN ao_ordering o ON o.okrug = b.okrug 
GROUP BY b.okrug, o.rank
ORDER BY o.rank;