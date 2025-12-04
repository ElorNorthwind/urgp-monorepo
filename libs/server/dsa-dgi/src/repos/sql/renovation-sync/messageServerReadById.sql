SELECT 
	m.id, 
	m.apartment_id as "affair_id",
	m.created_at as "created_at", 
	m.updated_at as "updated_at", 
	u.dsa_uuid as author_uuid,
	u.fio as author_fio,
	m.message_payload->-1->>'text' as "message_content",
	m.message_payload->-1->>'deleted' as "is_deleted"
FROM renovation.messages m
LEFT JOIN renovation.users u ON m.author_id = u.id
WHERE message_type = 'comment' AND m.id = ${id};