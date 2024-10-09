UPDATE renovation.messages
SET (message_payload, updated_at) = 
    (message_payload || jsonb_build_array(jsonb_build_object(
                         'date', NOW(),
                         'text', "",
                         'deleted', true,
                         'author', ${authorId}
                         )), 
    DEFAULT)
WHERE id = ${id} 
RETURNING (message_payload->-1->>'deleted')::boolean AS "isDeleted";