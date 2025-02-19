WITH marked_cases AS (
	SELECT UNNEST(ARRAY[${caseIds:list}]::integer[]) as id
), update_existing AS (
    UPDATE control.operations_
        SET 
        updated_by_id = ${userId},
        updated_at = NOW(),
        due_date = ${dueDate},
        done_date = null
    FROM marked_cases m
    WHERE case_id = m.id
    AND m.id IS NOT NULL
    AND class = 'reminder'
    AND control_from_id = ${userId}
)
INSERT INTO control.operations_ (
    case_id,
    class,
    type_id,
    author_id,
    approve_from_id,
    approve_to_id,
    approve_status,
    approve_date,
    due_date,
    control_from_id,
    control_to_id,
    notes
)
SELECT 
    m.id,
    'reminder',
    11,
    ${userId},
    ${userId},
    ${userId},
    'approved',
    NOW(),
    ${dueDate},
    ${userId},
    ${userId},
    'Слежение по группе дел'
FROM marked_cases m
LEFT JOIN control.operations_ o ON m.id = o.case_id
WHERE o.id IS NULL;