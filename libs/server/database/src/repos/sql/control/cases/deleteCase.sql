UPDATE control.cases_
SET 
    archive_date = NOW(),
    updated_at = NOW(),
    updated_by_id = ${updatedById}
WHERE id = ${id}
RETURNING id;


-- Hard delete variant:

-- DELETE FROM control.cases_
-- WHERE id = ${id} 
-- RETURNING id;