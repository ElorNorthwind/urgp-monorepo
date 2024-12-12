UPDATE control.operations
SET payload = payload || (payload->-1 || 
    jsonb_build_object(
            'type', ${type},
            'doneDate', ${doneDate},
            'num', ${num},
            'description', ${description},
            'approveNotes', null,
            'updatedAt', NOW(),
            'updatedBy', ${authorId}
                    ))
WHERE id = ${id} 
RETURNING id, author_id as "authorId", case_id as "caseId", problem_id as "problemId", 
          created_at as "createdAt", class, payload->-1 as payload;