SELECT m.id, m.created_at as "createdAt", 
       m.updated_at as "updatedAt",
       m.needs_answer as "needsAnswer",
       m.answer_date as "answerDate",
       m.apartment_id as "apartmentId",
       m.author_id as "authorId", u.fio as "authorFio", 
	   CASE WHEN 'boss' = ANY(roles) THEN true ELSE false END as "isBoss",
       m.message_payload->-1->>'text' as "messageContent"
FROM renovation.messages m
LEFT JOIN renovation.users u ON u.id = m.author_id
WHERE apartment_id = ANY(ARRAY[${apartmentIds:raw}]) AND (m.message_payload->-1->>'deleted')::boolean IS DISTINCT FROM true AND m.message_type = 'comment'
ORDER BY apartment_id, created_at ASC;