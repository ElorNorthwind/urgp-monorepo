UPDATE control.operations
SET payload = payload || (payload->-1 || 
    jsonb_build_object(
            'updatedAt', NOW(),
            'lastSeenDate', NOW(),
            'doneDate', NOW(),
            'updatedById', ${authorId},
            'description', 'Напоминание снято при групповом рассмотрении'
                    ))
WHERE   class = 'reminder' 
        AND case_id = ANY(ARRAY[${caseIds:raw}]) 
        AND author_id = ${authorId} 
        AND (payload->-1->>'isDeleted')::boolean = 'false'
        AND (payload->-1->>'doneDate')::date IS NULL
RETURNING id, author_id as "authorId", case_id as "caseId",
          created_at as "createdAt", class, payload->-1 as payload;
        --   dto.caseIds.join(','),