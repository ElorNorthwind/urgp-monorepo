WITH values(author_uuid, affair_id, message_text) AS (
	VALUES (${author_uuid}, ${affair_id}, ${message_text})
), insert_op AS (
	INSERT INTO renovation.messages (author_id, apartment_id, message_payload)
	SELECT 
		u.id,
		v.affair_id,
		jsonb_build_array(jsonb_build_object(
					 'date', CURRENT_TIMESTAMP,
					 'text', v.message_text,
					 'deleted', false,
					 'author', u.id
					 ))
	FROM values v
	LEFT JOIN renovation.users u ON v.author_uuid::uuid = u.dsa_uuid
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
FROM insert_op i
LEFT JOIN renovation.users u ON i.author_id = u.id;


-- WITH values(author_uuid, affair_id, message_text) AS (
-- 	VALUES ('f0fbf3c9-3ce2-4ae5-adc8-1d8da21ce713', 1032213, 'delete_me')
-- )
-- INSERT INTO renovation.messages (author_id, apartment_id, message_payload)
-- SELECT 
-- 	u.id,
-- 	v.affair_id,
-- 	jsonb_build_array(jsonb_build_object(
-- 				 'date', CURRENT_TIMESTAMP,
-- 				 'text', v.message_text,
-- 				 'deleted', false,
-- 				 'author', u.id
-- 				 ))
-- FROM values v
-- LEFT JOIN renovation.users u ON v.author_uuid::uuid = u.dsa_uuid