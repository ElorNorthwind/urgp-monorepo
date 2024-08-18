INSERT INTO renovation.messages (author_id, building_id, apartment_id, message_content, valid_until, needs_answer)
VALUES (${authorId}, ${buildingId}, ${apartmentId}, ${messageContent}, ${validUntil}, ${needsAnswer})
RETURNING id, created_at as "createdAt", updated_at as "updatedAt", 
          author_id as "authorId", apartment_id as "apartmentId", building_id as "buildingId",
          message_content as "messageContent", valid_until as "validUntil", needs_answer as "needsAnswer";