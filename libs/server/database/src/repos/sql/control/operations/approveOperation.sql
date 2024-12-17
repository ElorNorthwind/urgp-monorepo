UPDATE control.operations
SET payload = payload || (payload->-1 || 
    jsonb_build_object(
        'approver',      ${newApprover},
        'approveStatus', ${approveStatus},
        'approveNotes',  ${approveNotes},
        'approveDate',   NOW(),
        'approveBy',     ${userId},
        'updatedAt',     NOW(),
        'updatedBy',     ${userId}
                    ))
WHERE id = ${id} 
RETURNING id, author_id as "authorId", case_id as "caseId",
          created_at as "createdAt", class, payload->-1 as payload;