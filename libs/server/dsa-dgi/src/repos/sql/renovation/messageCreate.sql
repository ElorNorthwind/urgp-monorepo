INSERT INTO renovation.messages (author_id, building_id, apartment_id, message_payload, needs_answer)
VALUES (${authorId}, 
        ${buildingId}, 
        ${apartmentId}, 
        jsonb_build_array(jsonb_build_object(
                         'date', NOW(),
                         'text', ${messageContent},
                         'deleted', false,
                         'author', ${authorId}
                         )), 
        ${needsAnswer})
RETURNING id, created_at as "createdAt", updated_at as "updatedAt", message_type as "type",
          author_id as "authorId", apartment_id as "apartmentId", building_id as "buildingId",
          needs_answer as "needsAnswer",
        --   message_payload as "payload", 
          (message_payload->-1->>'date')::timestamp AT TIME ZONE 'Europe/Moscow' as "editedAt",
          (message_payload->-1->>'author')::integer as "editedBy",
          message_payload->-1->>'text' as "messageContent",
          (message_payload->-1->>'deleted')::boolean as "isDeleted";