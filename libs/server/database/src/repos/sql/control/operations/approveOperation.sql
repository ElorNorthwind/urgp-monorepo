UPDATE control.operations_
SET
    updated_by_id = ${userId},
    approve_from_id = ${userId},
    approve_to_id = ${approveToId},
    approve_status = ${approveStatus},
    approve_date = ${approveDate},
    approve_notes = ${approveNotes},
    updated_at = NOW()
WHERE id = ${id}
RETURNING id