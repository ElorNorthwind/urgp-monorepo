SELECT 
	old_apart_id as "apartmentId", 
	building_id as "buildingId",
	okrug,
	district,
	adress,
	apart_num as "apartmentNum",
	apart_type as "apartmentType",
	room_count as "roomCount",
	fio,
	old_apart_status as status,
	kpu_num as kpu,
	new_aparts as "newApartments",
	classificator,
	COALESCE(messages_count, 0) as "messagesCount",
	COUNT(*) OVER() as "totalCount"
FROM renovation.apartments_full a
LEFT JOIN (SELECT apartment_id, COUNT(*) as messages_count FROM renovation.messages WHERE is_deleted <> true AND apartment_id IS NOT NULL GROUP BY apartment_id) m ON a.old_apart_id = m.apartment_id
${conditions:raw}
LIMIT ${limit} OFFSET ${offset};