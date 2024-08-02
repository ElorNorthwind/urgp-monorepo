WITH ao_ordering(o_okrug, rank) AS (
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
), age_ordering(o_age, rank) AS (
	VALUES
    ('Не начато', 0),
    ('Менее месяца', 1),
    ('От 1 до 2 месяцев', 2),
    ('От 2 до 5 месяцев', 3),
    ('От 5 до 8 месяцев', 4),
    ('Более 8 месяцев', 5),
    ('Завершено', 6)
), status_ordering(o_status, rank) AS ( 
	VALUES 
    ('Не начато', 0),
    ('Переселение', 1),
    ('Отселение', 2),
    ('Снос', 3),
    ('Завершено', 4)
)
SELECT  
	id, 
	okrug, 
	district, 
	adress, 
	relocation_type_id as "relocationTypeId", 
	relocation_type as "relocationType", 
	total_apartments as "totalApartments", 
	building_deviation as "buildingDeviation", 
	relocation_age as "buildingRelocationStartAge", 
	relocation_status as "buildingRelocationStatus", 
	terms_reason as "termsReason", 
	terms, 
	new_building_constructions as "newBuildingConstructions", 
	new_building_movements as "newBuildingMovements", 
	jsonb_build_object('total', apartments->'total', 
					   'deviation', apartments->'deviationMFR') as apartments,
	problematic_aparts as "problematicAparts", 
	COUNT(*) OVER() AS "totalCount" 
FROM renovation.old_buildings_full b
LEFT JOIN ao_ordering o ON o.o_okrug = b.okrug
LEFT JOIN age_ordering a ON a.o_age = b.relocation_age
LEFT JOIN status_ordering s ON s.o_status = b.relocation_status
${conditions:raw} 
ORDER BY ${ordering:raw} 
LIMIT ${limit:raw} OFFSET ${offset:raw};