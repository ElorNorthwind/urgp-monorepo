UPDATE control.cases
SET payload = payload || jsonb_build_object(
                    'externalCases', ${externalCases:raw},
                    'type', t.val,
                    'directions', d.val,
                    'problems', ${problems:raw}, -- TBD
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
FROM 
  (SELECT to_jsonb(t) as val FROM control.case_types t WHERE id = ${type}) as t,
  (SELECT jsonb_agg(to_jsonb(d)) as val FROM control.directions d WHERE id = ANY(${directions:raw})) as d
WHERE id = ${id} 
RETURNING id, author_id as "authorId", created_at as "createdAt", payload->-1 as payload;