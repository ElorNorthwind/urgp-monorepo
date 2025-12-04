WITH values(message_id, message_text) AS (
	VALUES (${message_id}, ${message_text})
), update_op AS (
	UPDATE renovation.messages m
	SET message_payload = m.message_payload || jsonb_build_array(jsonb_build_object(
					 'date', CURRENT_TIMESTAMP,
					 'text', v.message_text,
					 'deleted', false,
					 'author', (m.message_payload->-1->>'author')::integer
					 ))
	FROM values v
	WHERE m.id = v.message_id
	RETURNING id, apartment_id, created_at, updated_at, author_id, message_payload
)
SELECT 
	i.id, 
	i.apartment_id as "affair_id",
	i.created_at as "created_at", 
	i.updated_at as "updated_at", 
	u.dsa_uuid as author_uuid,
	u.fio as author_fio,
	i.message_payload->-1->>'text' as "message_content",
	i.message_payload->-1->>'deleted' as "is_deleted"
FROM update_op i
LEFT JOIN renovation.users u ON i.author_id = u.id;
