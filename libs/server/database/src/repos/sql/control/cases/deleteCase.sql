UPDATE control.cases
SET payload = payload || (payload->-1 || 
 jsonb_build_object('updatedAt', NOW(),
                    'updatedBy', ${userId},
                    'isDeleted', true))
WHERE id = ${id} 
RETURNING id, class, author_id as "authorId", created_at as "createdAt", payload->-1 as payload;