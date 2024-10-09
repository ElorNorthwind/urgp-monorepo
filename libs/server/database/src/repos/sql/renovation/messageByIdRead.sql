SELECT id, created_at as "createdAt", 
       updated_at as "updatedAt", 
       author_id as "authorId",
       message_payload->-1->>'text' as "messageContent", 
       needs_answer as "needsAnswer",
       answer_date as "answerDate"
FROM renovation.messages
WHERE message_type = 'comment' 
  AND id = ${id};