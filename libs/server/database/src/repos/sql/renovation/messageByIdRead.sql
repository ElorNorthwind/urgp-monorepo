SELECT id, created_at as "createdAt", 
       updated_at as "updatedAt", 
       author_id as "authorId",
       message_content as "messageContent", 
       valid_until as "validUntil",
       needs_answer as "needsAnswer",
       answer_date as "answerDate"
FROM renovation.messages
WHERE id = ${id};