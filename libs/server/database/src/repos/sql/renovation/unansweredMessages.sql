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
    a.id as "apartmentId", 
    a.building_id as "buildingId",
    b.adress,
    b.okrug,
    b.district,
    a.apart_num as "apartNum",
    a.apart_type as "apartType",
    a.fio,
    a.kpu_num as "kpuNum",
    a.old_apart_status as "apartStatus",
    (a.classificator->>'stageName')::varchar as stage,
    (a.classificator->>'action')::varchar as "actionText",
    (a.classificator->>'deviation')::varchar as deviation,
    (a.classificator->'problems')::varchar as problems
FROM renovation.messages m 
LEFT JOIN renovation.apartments_old_temp a ON a.id = m.apartment_id
LEFT JOIN renovation.buildings_old b ON a.building_id = b.id
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
	WHERE im.apartment_id IS NOT NULL AND im.is_deleted <> true AND im.message_type = 'comment'
) lm on m.apartment_id = lm.apartment_id AND lm.rank = 1
WHERE a.id IS NOT NULL AND m.is_deleted <> true AND m.message_type = 'comment'
  AND needs_answer = true AND answer_date IS NULL
    ${conditions:raw} 
ORDER BY m.created_at DESC;