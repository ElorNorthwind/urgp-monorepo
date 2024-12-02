UPDATE control.cases
SET payload = payload || jsonb_build_object(
                    'externalCases', payload->-1->'externalCases',
                    'type', payload->-1->'type',
                    'directions', payload->-1->'directions',
                    'problems', payload->-1->'problems',
                    'description', payload->-1->'description',
                    'fio', payload->-1->'fio',
                    'adress', payload->-1->'adress',
                    'approver', payload->-1->'approver',
                    'approveStatus', payload->-1->'approveStatus',
                    'approveDate', payload->-1->'approveDate',
                    'approveBy', payload->-1->'approveBy',
                    'approveNotes', payload->-1->'approveNotes',
                    'updatedAt', NOW(),
                    'updatedBy', ${userId},
                    'isDeleted', true
                    )
WHERE id = ${id} 
RETURNING id, author_id as "authorId", created_at as "createdAt", payload->-1 as payload;

-- UPDATE renovation.messages
-- SET (message_payload, needs_answer, answer_date, updated_at) = 
--     (message_payload || jsonb_build_array(jsonb_build_object(
--                          'date', NOW(),
--                          'text', ${messageContent},
--                          'deleted', false,
--                          'author', ${authorId}
--                          )), 
--     ${needsAnswer}, 
--     ${answerDate}, 
--     DEFAULT)
-- WHERE id = ${id} 
-- RETURNING id, created_at as "createdAt", updated_at as "updatedAt", message_type as "type",
--           author_id as "authorId", apartment_id as "apartmentId", building_id as "buildingId",
--           needs_answer as "needsAnswer",
--         --   message_payload as "payload", 
--           (message_payload->-1->>'date')::timestamp AT TIME ZONE 'Europe/Moscow' as "editedAt",
--           (message_payload->-1->>'author')::integer as "editedBy",
--           message_payload->-1->>'text' as "messageContent",
--           (message_payload->-1->>'deleted')::boolean as "isDeleted";