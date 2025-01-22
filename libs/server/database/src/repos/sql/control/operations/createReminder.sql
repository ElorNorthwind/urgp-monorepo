INSERT INTO control.operations (class, author_id, case_id, payload)
VALUES
  ('reminder',
  ${authorId}, 
  ${caseId},
  jsonb_build_array(jsonb_build_object(
                    'typeId', ${typeId},
                    'observerId', ${observerId},
                    'description', ${description},
                    'lastSeenDate', ${seen},
                    -- 'lastSeenDate', null,
                    'dueDate', ${dueDate},
                    'doneDate', null,

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