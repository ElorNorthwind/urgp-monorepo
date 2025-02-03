INSERT INTO control.cases (author_id, class, payload)
VALUES
  (${authorId},
  'control-incident', 
  jsonb_build_array(jsonb_build_object(
                    'externalCases', ${externalCases:raw},
                    'typeId', ${typeId},
                    'directionIds', ${directionIds:raw},
                    'problemIds', ${problemIds:raw},
                    'description', ${description},
                    'fio', ${fio},
                    'adress', ${adress},
                    'approverId', ${approverId},
                    'approveStatus', ${approveStatus},
                    'approveDate', ${approveDate},
                    'approveById', ${approveById},
                    'approveNotes', null,
                    'updatedAt', NOW(),
                    'updatedBy', ${authorId},
                    'isDeleted', false
                    )))
RETURNING id, class, author_id as "authorId", created_at as "createdAt", payload->-1 as payload;