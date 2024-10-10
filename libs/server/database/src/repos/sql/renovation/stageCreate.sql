INSERT INTO renovation.messages (message_type, author_id, apartment_id, message_payload)
VALUES ('stage',
        ${authorId}, 
        ${apartmentId}, 
        jsonb_build_array(jsonb_build_object(
                         'date', DATE(),
                         'text', ${messageContent},
                         'deleted', false,
                         'author', ${authorId},
                         'stageId', ${stageId},
                         'docNumber', ${docNumber},
                         'docDate', ${docDate}
                         ))
        )
RETURNING id, created_at as "createdAt", updated_at as "updatedAt", message_type as "type",
          author_id as "authorId", apartment_id as "apartmentId", 
        --   message_payload as "payload", 
          (message_payload->-1->>'date')::timestamp AT TIME ZONE 'Europe/Moscow' as "editedAt",
          (message_payload->-1->>'author')::integer as "editedBy",
          message_payload->-1->>'text' as "messageContent",
        --   (message_payload->-1->>'deleted')::boolean as "isDeleted",
          (message_payload->-1->>'stageId')::integer as "stageId",
          message_payload->-1->>'docNumber' as "docNumber",
          (message_payload->-1->>'docDate')::date as "docDate";