INSERT INTO control.operations (class, author_id, case_id, payload)
VALUES
  ('dispatch',
  ${authorId}, 
  ${caseId},
  jsonb_build_array(jsonb_build_object(
                    'typeId', ${typeId},
                    'controllerId', ${controllerId},
                    'executorId', ${executorId},
                    'description', ${description},
                    'dateDescription', null,
                    'dueDate', ${dueDate},

                    'approverId', ${authorId},
                    'approveStatus', 'approved',
                    'approveDate', NOW(),
                    'approveById', ${authorId},
                    'approveNotes', null,
                    'updatedAt', NOW(),
                    'updatedById', ${authorId},
                    'isDeleted', false
                    )))
RETURNING id, author_id as "authorId", case_id as "caseId", 
          created_at as "createdAt", class, payload->-1 as payload;