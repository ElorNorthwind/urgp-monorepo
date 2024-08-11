SELECT id, created_at as "createdAt", 
       updated_at as "updatedAt", 
       author_id as "authorId",
       message_content as "messageContent", 
       valid_until as "validUntil"
FROM renovation.messages
WHERE id = ${id};