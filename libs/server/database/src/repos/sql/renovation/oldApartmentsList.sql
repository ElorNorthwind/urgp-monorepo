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
    FROM renovation.apartments_old_temp) a
    LEFT JOIN renovation.buildings_old b ON a.building_id = b.id
    LEFT JOIN (SELECT apartment_id, COUNT(*) as messages_count FROM renovation.messages WHERE is_deleted <> true AND apartment_id IS NOT NULL AND message_type = 'comment' GROUP BY apartment_id) m ON a.id = m.apartment_id
${conditions:raw}
ORDER BY adress, apart_npp
LIMIT ${limit} OFFSET ${offset};