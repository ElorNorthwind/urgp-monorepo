UPDATE renovation.messages
SET (message_payload, updated_at) = 
    (message_payload || jsonb_build_array(jsonb_build_object(
                         'date', NOW(),
                         'text', message_payload->-1->>'text',
                         'deleted', true,
                         'author', ${authorId},
                         'stageId', (message_payload->-1->>'stageId')::integer,
                         'docNumber', message_payload->-1->>'docNumber',
                         'docDate', message_payload->-1->>'docDate'
                         )), 
    DEFAULT)
WHERE id = ${id} 
RETURNING (message_payload->-1->>'deleted')::boolean AS "isDeleted";