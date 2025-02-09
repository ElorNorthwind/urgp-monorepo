UPDATE control.operations_
SET 
    archive_date = NOW(),
    updated_at = NOW(),
    updated_by_id = ${updatedById}
WHERE id = ${id}
RETURNING id;