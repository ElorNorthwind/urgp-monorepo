UPDATE control.cases
SET payload = payload || (payload->-1 || 
    jsonb_build_object(
        'externalCases', ${externalCases:raw},
        'type', ${type},
        'directions', ${directions:raw},
        'problems', ${problems:raw},
        'description', ${description},
        'fio', ${fio},
        'adress', ${adress},
        'updatedAt', NOW(),
        'updatedBy', ${userId}
                    ))
WHERE id = ${id} 
RETURNING id, author_id as "authorId", created_at as "createdAt", payload->-1 as payload;