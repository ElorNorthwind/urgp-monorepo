UPDATE control.operations
SET payload = payload || (payload->-1 || 
    jsonb_build_object(
            'updatedAt', NOW(),
            'lastSeenDate', NOW(),
            'updatedById', ${authorId}
                    ))
WHERE case_id = ANY(ARRAY[${caseIds:raw}]) AND author_id = ${authorId}
RETURNING id, author_id as "authorId", case_id as "caseId",
          created_at as "createdAt", class, payload->-1 as payload;
        --   dto.caseIds.join(','),