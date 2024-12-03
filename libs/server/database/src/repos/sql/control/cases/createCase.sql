INSERT INTO control.cases (author_id, payload)
SELECT 
  ${authorId}, 
  jsonb_build_array(jsonb_build_object(
                    'externalCases', ${externalCases:raw},
                    'type', t.val,
                    'directions', d.val,
                    'problems', ${problems:raw}, -- TBD
                    'description', ${description},
                    'fio', ${fio},
                    'adress', ${adress},
                    'approver', ${approver},
                    'approveStatus', 'pending',
                    'approveDate', null,
                    'approveBy', null,
                    'approveNotes', null,
                    'updatedAt', NOW(),
                    'updatedBy', ${authorId},
                    'isDeleted', false
                    ))
FROM 
  (SELECT to_jsonb(t) as val FROM control.case_types t WHERE id = ${type}) as t,
  (SELECT jsonb_agg(to_jsonb(d)) as val FROM control.directions d WHERE id = ANY(${directions:raw})) as d
RETURNING id, author_id as "authorId", created_at as "createdAt", payload->-1 as payload;