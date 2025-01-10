UPDATE control.operations
SET payload = payload || (payload->-1 || 
    jsonb_build_object(
            'doneDate', ${doneDate},
            'num', ${num},
            'description', ${description},
            'updatedAt', NOW(),
            'updatedById', ${authorId},
            'approveNotes', null
                    ))
WHERE id = ${id} 
RETURNING id, author_id as "authorId", case_id as "caseId",
          created_at as "createdAt", class, payload->-1 as payload;