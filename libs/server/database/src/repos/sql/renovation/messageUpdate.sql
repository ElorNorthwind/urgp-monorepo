UPDATE renovation.messages
SET (message_content, valid_until, updated_at) = 
    (${messageContent}, ${validUntil}, DEFAULT)
WHERE id = ${id}
RETURNING id, created_at as "createdAt", updated_at as "updatedAt", 
          author_id as "authorId", apartment_id as "apartmentId", building_id as "buildingId",
          message_content as "messageContent", valid_until as "validUntil";