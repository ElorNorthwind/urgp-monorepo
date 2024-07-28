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
       COUNT(*) FILTER (WHERE b."buildingRelocationStatus" = 'Завершено')::int as done,
       COUNT(*) FILTER (WHERE NOT b."buildingRelocationStatus" = ANY(ARRAY['Завершено', 'Не начато']))::int as "inProgress",
       COUNT(*) FILTER (WHERE b."buildingRelocationStatus" = 'Не начато')::int as "notStarted"
FROM renovation.old_buildings_fe b
LEFT JOIN ao_ordering o ON o.okrug = b.okrug
GROUP BY b.okrug, o.rank
ORDER BY o.rank;