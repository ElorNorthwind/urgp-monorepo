UPDATE control.operations
SET payload = payload || (payload->-1 || 
    jsonb_build_object(
        'approverId',    ${newApproverId},
        'approveStatus', ${approveStatus},
        'approveNotes',  ${approveNotes},
        'approveDate',   NOW(),
        'approveById',   ${userId},
        'updatedAt',     NOW(),
        'updatedById',   ${userId}
                    ))
WHERE id = ${id} 
RETURNING id, author_id as "authorId", case_id as "caseId",
          created_at as "createdAt", class, payload->-1 as payload;