INSERT INTO control.cases (author_id, class, payload)
VALUES
  (${authorId},
  'control-incident', 
  jsonb_build_array(jsonb_build_object(
                    'externalCases', ${externalCases:raw},
                    'type', ${type},
                    'directions', ${directions:raw},
                    'problems', ${problems:raw},
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
                    )))
RETURNING id, class, author_id as "authorId", created_at as "createdAt", payload->-1 as payload;