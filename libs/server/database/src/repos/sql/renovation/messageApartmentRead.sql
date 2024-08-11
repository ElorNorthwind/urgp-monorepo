SELECT m.id, m.created_at as "createdAt", m.updated_at as "updatedAt", 
       m.apartment_id as "apartmentId",
       m.author_id as "authorId", u.fio as "authorFio", 
	   CASE WHEN 'boss' = ANY(roles) THEN true ELSE false END as "isBoss",
       m.message_content as "messageContent", m.valid_until as "validUntil"
FROM renovation.messages m
LEFT JOIN renovation.users u ON u.id = m.author_id
WHERE apartment_id = ANY(ARRAY[${apartmentIds:raw}]) AND m.is_deleted = false
ORDER BY apartment_id, created_at ASC;