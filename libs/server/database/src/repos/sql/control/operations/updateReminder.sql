UPDATE control.operations
SET payload = payload || (payload->-1 || 
    jsonb_build_object(
        --     'observerId', ${observerId},
            'description', ${description},
            'updatedAt', NOW(),
            'lastSeenDate', NOW(),
            'dueDate', ${dueDate},
            'doneDate', ${doneDate},
            'updatedById', ${authorId},
            'approveNotes', null
                    ))
WHERE id = ${id} 
RETURNING id, author_id as "authorId", case_id as "caseId",
          created_at as "createdAt", class, payload->-1 as payload;