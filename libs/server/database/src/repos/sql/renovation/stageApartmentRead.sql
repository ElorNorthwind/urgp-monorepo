SELECT m.id, m.created_at as "createdAt", 
       m.updated_at as "updatedAt", 
       m.apartment_id as "apartmentId",
       m.author_id as "authorId", 
       u.fio as "authorFio", 
	   (message_payload->-1->>'stageId')::integer as "stageId",
	   s.name as "stageName",
	   s.group_name as "group",
	   s.next_action_text as "action",
	   s.priority as "priority",
       message_payload->-1->>'text' as "messageContent",
	   message_payload->-1->>'docNumber' as "docNumber",
	   (message_payload->-1->>'docDate')::date as "docDate"
FROM renovation.messages m
LEFT JOIN renovation.users u ON u.id = m.author_id
LEFT JOIN renovation.apartment_stages s ON s.id = (message_payload->-1->>'stageId')::integer
WHERE m.message_type = 'stage' AND (m.message_payload->-1->>'deleted')::boolean IS DISTINCT FROM true 
  AND (message_payload->-1->>'stageId')::integer IS NOT NULL
  AND apartment_id = ANY(ARRAY[${apartmentIds:raw}])
ORDER BY apartment_id, created_at ASC;