SELECT 
    m.id,
    m.created_at as "createdAt",
    m.updated_at as "updatedAt",
    m.message_content as "messageContent",
    m.message_type as "messateType",
    m.author_id as "authorId",
    u.fio as author,
    u.roles,
	
    lm.id as "lastMessageId",
    lm.message_content as "lastMessageContent",
    lm.message_type as "lastMessateType",
    lm.created_at as "lastMessageCreatedAt",
    lm.author as "lastMessageAuthor",
		
    a.old_apart_id as "apartmentId", 
    a.building_id as "buildingId",
    a.adress,
    a.okrug,
    a.district,
    a.apart_num as "apartNum",
    a.apart_type as "apartType",
    a.fio,
    a.kpu_num as "kpuNum",
    a.old_apart_status as "apartStatus",
    a.stage,
    a.action_text as "actionText",
    a.deviation,
    a.problems
FROM renovation.messages m 
LEFT JOIN renovation.apartments_full a ON a.old_apart_id = m.apartment_id
LEFT JOIN renovation.users u ON m.author_id = u.id
LEFT JOIN (
	SELECT 
	rank() OVER (PARTITION BY im.apartment_id ORDER BY im.created_at DESC, im.id) as rank,
	im.id, 
	im.message_content, 
	im.message_type, 
	im.apartment_id,
	im.author_id,
	im.created_at,
	u.fio as author
	FROM renovation.messages im 
	LEFT JOIN renovation.users u ON im.author_id = u.id
	WHERE im.apartment_id IS NOT NULL AND im.is_deleted <> true
) lm on m.apartment_id = lm.apartment_id AND lm.rank = 1
WHERE m.apartment_id IS NOT NULL AND m.is_deleted <> true
  AND needs_answer = true AND answer_date IS NULL
  ${conditions:raw} 
ORDER BY m.created_at DESC;