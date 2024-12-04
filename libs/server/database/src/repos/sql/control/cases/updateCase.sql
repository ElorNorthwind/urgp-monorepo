UPDATE control.cases
SET payload = payload || jsonb_build_object(
                    'externalCases', ${externalCases:raw},
                    'type', ${type},
                    'directions', ${directions:raw},
                    'problems', ${problems:raw},
                    'description', ${description},
                    'fio', ${fio},
                    'adress', ${adress},
                    'approver', payload->-1->'approver',
                    'approveStatus', payload->-1->'approveStatus',
                    'approveDate', payload->-1->'approveDate',
                    'approveBy', payload->-1->'approveBy',
                    'approveNotes', payload->-1->'approveNotes',
                    'updatedAt', NOW(),
                    'updatedBy', ${userId},
                    'isDeleted', payload->-1->'isDeleted'
                    )
WHERE id = ${id} 
RETURNING id, author_id as "authorId", created_at as "createdAt", payload->-1 as payload; -- TBD