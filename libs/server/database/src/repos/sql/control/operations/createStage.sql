INSERT INTO control.operations (class, author_id, case_id, problem_id, payload)
VALUES
  ('stage',
  ${authorId}, 
  ${caseId},
  ${problemId},
  jsonb_build_array(jsonb_build_object(
                    'type', ${type},
                    'doneDate', ${doneDate},
                    'num', ${num},
                    'description', ${description},
                    'approver', ${approver},
                    'approveStatus', ${approveStatus},
                    'approveDate', ${approveDate},
                    'approveBy', ${approveBy},
                    'approveNotes', null,
                    'updatedAt', NOW(),
                    'updatedBy', ${authorId},
                    'isDeleted', false
                    )))
RETURNING id, author_id as "authorId", case_id as "caseId", problem_id as "problemId", 
          created_at as "createdAt", class, payload->-1 as payload;