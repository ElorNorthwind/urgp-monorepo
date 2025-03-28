INSERT INTO control.operations_ (
    case_id,
    class,
    type_id,
    author_id,
    -- updated_by_id,
    approve_from_id,
    approve_to_id,
    approve_status,
    approve_date,
    approve_notes,
    due_date,
    done_date,
    control_from_id,
    control_to_id,
    title,
    notes,
    extra
    -- archive_date
)
VALUES (
    ${caseId}, -- case_id (required)
    ${class}, -- class (default is 'stage')
    ${typeId}, -- type_id (required)
    ${authorId}, -- author_id (optional)
    -- ${updatedById}, -- updated_by_id (optional)
    ${authorId}, -- ${approveFromId}, -- approve_from_id (optional)
    ${approveToId}, -- approve_to_id (optional)
    ${approveStatus}, -- approve_status (default is 'project')
    ${approveDate}, -- approve_date (optional)
    ${approveNotes}, -- approve_notes (optional)
    ${dueDate}, -- due_date (optional)
    ${doneDate}, -- done_date (optional)
    ${controlFromId}, -- control_from_id (optional)
    ${controlToId}, -- control_to_id (optional)
    ${title}, -- title (optional)
    ${notes}, -- notes (optional)
    ${extra} -- extra (optional)
    -- ${archiveDate} -- archive_date (optional)
)
ON CONFLICT (case_id, control_to_id) WHERE class = 'reminder' DO UPDATE 
SET (
    type_id,
    author_id,
    approve_from_id,
    approve_to_id,
    approve_status,
    approve_date,
    approve_notes,
    due_date,
    done_date,
    control_from_id,
    control_to_id,
    title,
    notes,
    extra
) = (
    EXCLUDED.type_id,
    EXCLUDED.author_id,
    EXCLUDED.approve_from_id,
    EXCLUDED.approve_to_id,
    EXCLUDED.approve_status,
    EXCLUDED.approve_date,
    EXCLUDED.approve_notes,
    EXCLUDED.due_date,
    EXCLUDED.done_date,
    EXCLUDED.control_from_id,
    EXCLUDED.control_to_id,
    EXCLUDED.title,
    EXCLUDED.notes,
    EXCLUDED.extra
)
RETURNING id;