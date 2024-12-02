UPDATE control.cases
SET payload = payload || jsonb_build_object(
                    'externalCases', payload->-1->'externalCases',
                    'type',          payload->-1->'type',
                    'directions',    payload->-1->'directions',
                    'problems',      payload->-1->'problems',
                    'description',   payload->-1->'description',
                    'fio',           payload->-1->'fio',
                    'adress',        payload->-1->'adress',
                    'approver',      ${newApprover},
                    'approveStatus', ${approveStatus},
                    'approveNotes',  ${approveNotes},
                    'approveDate',   NOW(),
                    'approveBy',     ${userId},
                    'updatedAt',     NOW(),
                    'updatedBy',     ${userId},
                    'isDeleted',     payload->-1->'isDeleted'
                    )
WHERE id = ${id}
RETURNING id, author_id as "authorId", created_at as "createdAt", payload->-1 as payload;