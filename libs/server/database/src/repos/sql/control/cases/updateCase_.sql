UPDATE control.cases
SET payload = payload || (payload->-1 || 
    jsonb_build_object(
        'externalCases', ${externalCases:raw},
        'typeId', ${typeId},
        'directionIds', ${directionIds:raw},
        'problemIds', ${problemIds:raw},
        'description', ${description},
        'fio', ${fio},
        'adress', ${adress},
        'updatedAt', NOW(),
        'updatedById', ${userId}
                    ))
WHERE id = ${id} 
RETURNING id, class, author_id as "authorId", created_at as "createdAt", payload->-1 as payload;