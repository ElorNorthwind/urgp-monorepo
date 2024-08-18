UPDATE renovation.messages
SET (message_content, valid_until, needs_answer, answer_date, updated_at) = 
    (${messageContent}, ${validUntil}, ${needsAnswer}, ${answerDate}, DEFAULT)
WHERE id = ${id}
RETURNING id, created_at as "createdAt", updated_at as "updatedAt", 
          author_id as "authorId", apartment_id as "apartmentId", building_id as "buildingId",
          message_content as "messageContent", valid_until as "validUntil";