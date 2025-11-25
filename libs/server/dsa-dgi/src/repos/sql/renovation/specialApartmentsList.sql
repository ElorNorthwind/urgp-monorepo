SELECT 
	a.id as "apartmentId", 
	a.id as "buildingId",
	b.okrug,
	b.district,
	b.adress,
	a.apart_num as "apartmentNum",
	a.apart_type as "apartmentType",
	a.room_count as "roomCount",
	a.fio,
	a.old_apart_status as status,
	a.kpu_num as kpu,
	a.new_aparts as "newApartments",
	a.classificator,
	COALESCE(messages_count, 0) as "messagesCount",
	COUNT(*) OVER() as "totalCount"
FROM (SELECT 
        id, 
        building_id, 
        apart_num, 
	    apart_type,
	  	room_count,
	  	kpu_num,
        fio, 
        old_apart_status, 
        new_aparts, 
        stages_dates, 
        classificator, 
        ROW_NUMBER() OVER (PARTITION BY building_id ORDER BY building_id, CAST(substring(apart_num, '\d+') AS integer), fio) as apart_npp 
    FROM renovation.apartments_old) a
    LEFT JOIN renovation.buildings_old b ON a.building_id = b.id
    LEFT JOIN (SELECT apartment_id, COUNT(*) as messages_count FROM renovation.messages WHERE (message_payload->-1->>'deleted')::boolean IS DISTINCT FROM true AND apartment_id IS NOT NULL GROUP BY apartment_id) m ON a.id = m.apartment_id
WHERE b.id IS NOT NULL AND (old_apart_status LIKE ANY(ARRAY['%аренда%', '%служебн%', '%общежит%'])
OR (classificator->>'stageId')::integer = ANY(ARRAY[69, 70, 71, 72, 73, 51, 52, 54, 54, 55, 56, 67]))
ORDER BY adress, apart_npp;